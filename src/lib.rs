use crate::discord::*;
use crate::verify::verify;
use reqwest;
use serde_json;
use worker::*;

mod discord;
mod utils;
mod verify;

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}], located at: {:?}, within: {}",
        Date::now().to_string(),
        req.path(),
        req.cf().coordinates().unwrap_or_default(),
        req.cf().region().unwrap_or("unknown region".into())
    );
}

async fn validate_request(mut req: Request, public_key: String) -> Option<String> {
    let x_sig_ed = req.headers().get("X-Signature-Ed25519").unwrap();
    let x_sig_time = req.headers().get("X-Signature-Timestamp").unwrap();

    if x_sig_ed.is_none() || x_sig_time.is_none() {
        return None;
    }

    let body = req.text().await.unwrap();

    if verify(&x_sig_ed.unwrap(), &x_sig_time.unwrap(), &body, public_key) {
        return Some(body);
    }
    None
}

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    log_request(&req);

    utils::set_panic_hook();
    let router = Router::new();

    router
        .get("/", |_, _| Response::ok("Hello from Workers!"))
        .post_async("/", |req, ctx| async move {
            let body = validate_request(req, ctx.secret("PUBLIC_KEY").unwrap().to_string()).await;

            if body.is_none() {
                console_log!("Failed to validate request");
                return Response::error("Bad Request", 400);
            }

            let i = serde_json::from_str::<Interaction>(&body.unwrap());
            if i.is_err() {
                console_log!("Failed to get the json from Discord {:#?}", i.err());
                return Response::error("Bad Request", 400);
            }
            let interaction = i.unwrap();

            if interaction.interaction_type == InteractionType::Ping {
                console_log!("Ping ----> Pong");
                return Response::from_json(&InteractionResponse {
                    data: None,
                    interaction_type: InteractionResponseType::Pong,
                });
            }

            if interaction.interaction_type == InteractionType::ApplicationCommand {
                let interaction_data = match interaction.data {
                    Some(data) => data,
                    None => return Response::error("Bad Request", 400),
                };

                if interaction_data.name == "report_result" {
                    let options = interaction_data.options.unwrap();
                    let code = options[0].value.as_ref().unwrap();

                    let url = format!(
                        "http://tbagolftourapi.azurewebsites.net/api/reportresult/{}",
                        code
                    );

                    let client = reqwest::Client::new();
                    let _response = client.get(&url).send().await;

                    return Response::from_json(&InteractionResponse {
                        data: Some(InteractionResponseData {
                            content: format!("Done!"),
                        }),
                        interaction_type: InteractionResponseType::ChannelMessageWithSource,
                    });
                }
            }

            Response::from_json(&InteractionResponse {
                data: None,
                interaction_type: InteractionResponseType::Pong,
            })
        })
        .run(req, env)
        .await
}

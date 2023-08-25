import axios from "axios";

const url = "https://graph.facebook.com/v17.0/100278359467474/messages";

export async function sendWhatsappMsg(data) {
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer EAAyOqhJSG2sBO8X3DFsIy6cZBYCCxKRFWFECnqFF4ra1YOn315QWI5JP1Vk3QQgvya3R1Vd6tLhnxgPESNy1ZCn7hqVodQXvxMcyptiztDts22rXZBM76gnnKLmAnJLwa1WZAvuZAtld6pZBqwZAXZAntT9qOBhq4N0sWQNm7yHgLspuFQRv50EkPbAr3O7v59D4",
    },
  };
  
  await axios.post(url, data, options);
}

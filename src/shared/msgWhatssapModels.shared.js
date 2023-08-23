export function sendText(textResponse, number) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "text",
    text: {
      body: textResponse,
    },
  };
  return data;
}

export function sendImage(number) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "image",
    image: {
      link: "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/image_whatsapp.png",
    },
  };
  return data;
}

export function sendAudio(number) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "audio",
    audio: {
      link: "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/audio_whatsapp.mp3",
    },
  };
  return data;
}

export function sendVideo(number) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "video",
    video: {
      link: "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/video_whatsapp.mp4",
      caption: "Video Example",
    },
  };
  return data;
}

export function sendDocument(number) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "document",
    document: {
      link: "https://biostoragecloud.blob.core.windows.net/resource-udemy-whatsapp-node/document_whatsapp.pdf",
    },
  };
  return data;
}

export function sendButtons(number) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: "¿Confirmas tu registro?",
      },
      action: {
        buttons: [
          {
            type: "reply",
            reply: {
              id: "001",
              title: "Sí",
            },
          },
          {
            type: "reply",
            reply: {
              id: "002",
              title: "No",
            },
          },
        ],
      },
    },
  };
  return data;
}

export function sendList(number) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "interactive",
    interactive: {
      type: "list",
      body: {
        text: "Tengo estas opciones",
      },
      footer: {
        text: "Selecciona una de estas opciones para poder atenderte",
      },
      action: {
        button: "Ver opciones",
        sections: [
          {
            title: "Compra y vende productos",
            rows: [
              {
                id: "main-compra",
                title: "Comprar",
                description: "Compra los mejores productos para tu hogar",
              },
              {
                id: "main-vender",
                title: "Vender",
                description: "Vender productos",
              },
            ],
          },
          {
            title: "Centro de atencion",
            rows: [
              {
                id: "main-agencia",
                title: "Agencia",
                description: "Pudes visitar nuestra agencia",
              },
              {
                id: "main-contacto",
                title: "Centro de contacto",
                description: "Te atendera uno de nustros agentes",
              },
            ],
          },
        ],
      },
    },
  };
  return data;
}

export function sendLocation(number) {
  const data = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: number,
    type: "location",
    location: {
      latitude: "-12.103407141692893",
      longitude: "-75.20215197245516",
      name: "My Home",
      address: "28 de Julio Huancayo 12000",
    },
  };
  return data;
}

import axios from "axios";

const url = "https://graph.facebook.com/v17.0/100278359467474/messages";

export async function sendWhatsappMsg(data) {
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer EAAOpUJi1i6ABO6LFLWdDjSEl5X1ZA3lJOGZBXdXoRLZC4uIsZB1SBQZCcXZAsiyXhOL22edZAkx4KZAXc2iGWDFh9NfN59tUKbs7wPXeP2dQWFR1CPRonaoGDUrtlLfGq6EZC1oWBAzvinH31aDDDYN33vZAjEZA3jeTLVHcDZCpR9ZCJlcNHuBTTjS6BN9etqZBYZAUmyZADaUQeCMALtKBCe0G",
    },
  };

  await axios.post(url, data, options);
}

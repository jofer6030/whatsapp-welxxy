import axios from "axios";

const url = "https://graph.facebook.com/v17.0/158011757387515/messages";

export async function sendWhatsappMsg(data) {
  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization:"Bearer EAALwVdtRjxYBOzZCPGRbLs6h6IKktPgGesxfr7mtjhMp07xRbdTg0K4ZBFBCnb2VboL62erqLmm1egx3ZASpTqGljb5kdmW9d5wWuzm2yVVTfuCaYcTz2BpuZBe9yEIAtSU0aZB7xxpW5Wb4euyXDXjZBa3DOqmD9tqGXYd4KCv7KR1dgZCgVi01rjloct3zKPTqb2R89Pe0fmfdCjX",
    },
  };

  await axios.post(url, data, options);
}

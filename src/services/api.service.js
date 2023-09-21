import axios from 'axios'

class ApiService {
  #apiService
  #url = "https://qx4l1062-3000.brs.devtunnels.ms"
  #tokenApiPeru = "60b7488892af2dc1119acab61abdea74fa18a0a4f0a1b0c1d4d309d379369974"
  
  constructor() {
    this.#apiService = axios
  }

  async createUser(user) {
    await this.#apiService.post(`${this.#url}/user/create`,user)
  }
  async updateUser(user) {
    const {number,...rest} = user
    const {data} = await this.#apiService.put(`${this.#url}/user/update?nro_celular=${number}`,rest);
    return data
  }

  async getUserByTel(nroTel) {
    const {data} =  await this.#apiService.get(`${this.#url}/user/list/${nroTel}`)
    return data;
  }
  async createOrden(data) {
    await this.#apiService.post(`${this.#url}/orden/create`,data)
  }

  async getInfoByDni(dni) {
    const {data} = await this.#apiService.get(`https://apiperu.dev/api/dni/${dni}`, {
      headers: {
        Authorization: `Bearer ${this.#tokenApiPeru}`
      }
    })
    return data
  }
}

export default ApiService
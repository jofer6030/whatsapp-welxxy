import axios from 'axios'

const url = "https://gi-a47t.onrender.com"

class ApiService {
  #apiService
  constructor() {
    this.#apiService = axios
  }

  async createUser(user) {
    await this.#apiService.post(`${url}/user/create`,user)
  }
  async updateUser(user) {
    const {number,...rest} = user
    const {data} = await this.#apiService.put(`${url}/user/update/${number}`,rest);
    return data
  }

  async getUserByTel(nroTel) {
    let info;
    try {
      const response =  await this.#apiService.get(`${url}/user/list-tef/${nroTel}`)
      info = response
    }catch (error){
      info = error.response
    }

    return info;
  }
  async createOrden(data) {
    await this.#apiService.post(`${url}/orden/create`,data)
  }
}

export default ApiService
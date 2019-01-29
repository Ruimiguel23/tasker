import axios from 'axios'

export default axios.create({
    baseURL:"localhost/api",
    timeout:5000
})

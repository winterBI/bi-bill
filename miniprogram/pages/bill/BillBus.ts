import Request from "../../utils/Request"

class Bill extends Request {
    getBillList(year: string | number) {
        return this.post('bill/year', {year}, true, false)
    }
}

export default Bill
import Request from "../../utils/Request"

class My extends Request {

    /**
     * 获取记录的笔数
     */
    getCount() {
        return this.get('bill/count')
    }

    /**
     * 获取用户信息
     */
    getUserInfo() {
        return this.get('user/get')
    }
}

export default My
import Request from "../../utils/Request"
import { Type } from "./addInterface"
class Add extends Request {

    /**
     * 获取分类数据
     * @param type 类别类型
     */
    getCategory(type: Type = 1) {
        return this.post('category', {type})
    }
}

export default Add
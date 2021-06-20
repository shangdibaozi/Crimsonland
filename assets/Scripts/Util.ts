import { Quat } from "cc";

export class Util {

    /**
     * 
     * @param minVal 
     * @param maxVal 
     * @returns [minVal, maxVal)
     */
    static randomRange(minVal: number, maxVal: number) {
        return Math.random() * (maxVal - minVal) + minVal;
    }

    /**
     * 求以n为底x的对数
     * @param x 待求数
     * @param n 底
     */
    static lg(x: number, n: number) {
        return Math.log(x) / Math.log(n);
    }

    static time2str(time: number, type: 'h' | 'm' = 'h') {
        let s = Math.floor(time % 60);
        if (type === 'm') {
            let m = Math.floor(time / 60) % 60;
            return `${m >= 10 ? m : '0' + m}:${s >= 10 ? s : '0' + s}`;
        }
        else if (type === 'h') {
            let m = Math.floor(time / 60) % 60;
            let h = Math.floor(time / 3660);
            return `${h >= 10 ? h : '0' + h}:${m >= 10 ? m : '0' + m}:${s >= 10 ? s : '0' + s}`;
        }
        else {
            return `${s}`;
        }
    }

    static date2str(time: number, str1: string, str2: string) {
        let _change = (n: number) => {
            return n >= 10 ? n.toString() : '0' + n;
        };
        let date = new Date(time);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();

        return `${year}${str1}${_change(month)}${str1}${_change(day)} ${_change(h)}${str2}${_change(m)}${str2}${_change(s)}`;
    }

    static toInt(num: number) {
        return Math.floor(Math.round(num));
    }

    /**
     * 从列表中随机选择一个
     * @param lst 
     */
    static randomChoice<T>(lst: T[], end: number = 0) {
        return lst[Math.random() * (end > 0 ? end : lst.length) >>> 0];
    }

    /**
     * 快速删除数组中的指定元素
     * @param arr 
     */
    static arrFastRemove(arr: any[], delObj: any) {
        let idx = arr.indexOf(delObj);
        if (idx >= 0) {
            arr[idx] = arr[arr.length - 1];
            arr.length--;
        }
    }

   

    static second2hour(second: number) {
        return second / 3600;
    }


    /**
     * 从列表中随机选择元素
     * @param arr 列表
     * @param conditionCheck 元素条件判断
     * @param getWeight 获得每个元素的权值
     * @returns -1表示没有随机到、其他值表示随机到的元素下标
     */
    static randomIdx<T>(arr: T[], conditionCheck: (elem: T) => boolean, getWeight: (elem: T) => number) {
        let val = Math.random();
        let endWeight = 0;
        let total = 0;
        let idx = -1;
        let w = 0;
        for (let i = 0, len = arr.length; i < len; i++) {
            if (conditionCheck(arr[i])) {
                w = getWeight(arr[i]);
                total += w * val;       // 对每个元素的权值*随机数进行累加
                if (total >= endWeight) {   // 只有大于上个权重边界值才进入到下个元素
                    if(idx === -1) {
                        idx = i;
                    }
                    else {
                        // arr中间会有不满足条件的元素，所以需要往后寻找下个满足条件的元素位置
                        for(let j = idx + 1; j <= i; j++) {
                            if(conditionCheck(arr[j])) {
                                idx = j;
                                break;
                            }
                        }
                    }
                    endWeight += w;
                }
            }
        }
        return idx;
    }

    /**
    * 四元数插值
    * 
    * https://forum.cocos.org/t/topic/100870
    * @param out 
    * @param a 
    * @param b 
    * @param t 
    */
     static quatLerp(out: Quat, a: Quat, b: Quat, t: number) {
        if (Quat.dot(a, b) < 0.0) {
            out.x = -b.x;
            out.y = -b.y;
            out.z = -b.z;
            out.w = -b.w;
        }
        else {
            Quat.copy(out, b);
        }
        Quat.lerp(out, a, out, t);
        Quat.normalize(out, out);
        return out;
    }
}
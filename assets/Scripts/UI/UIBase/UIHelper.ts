/**
 * 使用方法
 * ui名称以‘_’开头的的节点会被解析到
 * ui名称中含有‘$’则表示需要读取这个节点下的组件，$后面的数值表示需要哪个组件，默认的node下组件在_components里面的索引是按照“属性检查器”中显示是组件顺序来的
 *  $023就表示获取第1个和第3，4个组件
 * ui名称以‘__’为名称开头的节点表示不遍历其子节点
 * 
 * 不能命名_name的节点，会覆盖CCNode的_name
 * 
 * 如果多个按钮响应相同的操作，那么可以按照如下规则给这些按钮命名：_btnTest_1、_btnTest_2，其中回调方法为on_btnTest，按钮在脚本中的名称为_btnTest_1、_btnTest_2
 */

import { Node, Component, error, Button, EventHandler } from "cc";

type UICacheStruct = { [key: string]: { [key: string]: number[] } };

export class UIHelper {
    // 缓存节点路径
    private _cache: UICacheStruct = Object.create(null); // 这样创建的{}在查找其属性的时候不需要使用Object.hasDefineProperty去判断是否含有指定属性。


    bindUI(uiRoot: Node, target: Component) {
        let uiName = target.name;
        uiName = uiName.substring(uiName.indexOf('<') + 1, uiName.lastIndexOf('>')); // 节点的名称可能会不一样，而脚本组件的名称不会改变

        if (uiName.length === 0) { // 节点没有绑定脚本组件的情况下使用节点名称
            uiName = uiRoot.name;
            let $index = uiName.indexOf('$');
            if ($index > 0) {
                uiName = uiName.substring(0, $index);
            }
        }

        let cache = this._cache[uiName];
        if (cache) {
            this.bindUI2TargetByCache(uiRoot, cache, target);
        }
        else {
            cache = Object.create(null);
            this._cache[uiName] = cache;

            let usefulNode: Node[] = [];
            this.findAllNode(uiRoot, usefulNode, cache, []);
            this.bindUI2Target(usefulNode, target);
        }
    }

    // 深度优先的方式访问ui树
    private findAllNode(node: Node, outArr: Node[], cache: { [key: string]: number[] }, path: number[]) {
        let child: Node;
        for (let i = 0, len = node.children.length; i < len; i++) {
            child = node.children[i];
            if (child.name.startsWith('___')) { // 不遍历3下划线开头节点的子节点
                continue;
            }

            if (child.name[0] === '_') {// 节点名称以“_”开头的节点记录下来
                outArr.push(child);
                let newPath = path.slice();
                newPath.push(i);
                cache[child.name] = newPath;
            }

            if (child.children.length <= 0) {
                continue;
            }

            if (child.name.length >= 3 && child.name[1] === '_') { // 不遍历以‘__’为开头的节点的子节点
                continue;
            }

            let newPath = path.slice();
            newPath.push(i);
            this.findAllNode(node.children[i], outArr, cache, newPath);
        }
    }

    private bindUI2Target(nodes: Node[], target: Component) {
        // console.log('---------------------bindUI2Target---------------------', target.name);
        for (let i = nodes.length - 1, node = null; i >= 0; i--) {
            node = nodes[i];
            let index = node.name.indexOf('$')
            let hasComp = index > 0;
            let hasBtn = node.name.indexOf('_btn') >= 0;

            let propertyName = hasComp ? node.name.substring(0, index) : node.name;
            // @ts-ignore
            target[propertyName] = node;

            // 绑定组件，直接访问
            hasComp && this.bindCompnent(node, index);
            // 给按钮绑定事件
            if (hasBtn) {
                let btnName: string = node.name;
                btnName = (index < 0 ? btnName : btnName.substring(0, index));
                let second_ = btnName.indexOf('_', 1); // 查找是否有第二个“_”，第二个“_”前面的字符串为回调方法，这样就能让需要有相同回调方法的按钮响应同一个方法。
                btnName = second_ > -1 ? btnName.substring(0, second_) : btnName;
                let callbackName = `on${btnName}`;
                this.bindBtnEvent(node, target, callbackName);
            }
        }
    }

    private bindCompnent(node: Node, index: number) {
        let nodeName = node.name;
        let comName = null;
        let componentCnt = node['_components'].length;
        for (let i = nodeName.length - 1; i > index; i--) {
            if ('0' <= nodeName[i] && nodeName[i] <= '9') {
                let idx = Number(nodeName[i]);
                if (idx >= componentCnt) {
                    error(`${nodeName} component index:${idx} out of range.`);
                    return;
                }
                comName = node['_components'][idx].name;
                comName = comName.substring(comName.indexOf('<') + 1, comName.lastIndexOf('>'));
                // @ts-ignore
                node['$' + comName] = node['_components'][idx];
            }
            else {
                error('wrong component index ' + nodeName);
            }
        }
    }

    private bindUI2TargetByCache(uiRoot: Node, cache: { [key: string]: number[] }, target: Component) {
        let nodes = [];
        let node = null;
        for (let nodeName in cache) {
            node = this.find(cache[nodeName], uiRoot);
            if (node) {
                nodes.push(node);
            }
            else {
                error('not found node.', nodeName, cache[nodeName], uiRoot.name);
            }
        }
        this.bindUI2Target(nodes, target);
    }

    /**
     * 根据子节点索引获取子节点
     * @param {number[]} path [0, 2, 23]
     * @param {cc.Node} node 
     */
    private find(path: number[], node: Node) {
        let match = node;

        for (let i = 0, len = path.length; i < len; i++) {
            match = match['_children'][path[i]];
        }

        if (!match) {
            return null;
        }

        return match;
    }

    /**
     * 绑定按钮回调
     */
    private bindBtnEvent(btnNode: Node, target: Component, callbackName: string) {
        let eventHandler = new EventHandler();
        eventHandler.target = target.node;
        eventHandler.component = target.name.substring(target.name.indexOf('<') + 1, target.name.indexOf('>'));
        eventHandler.handler = callbackName // 绑定回调方法名称
        eventHandler.customEventData = '';
        let btnComp = btnNode.getComponent(Button);
        if (btnComp) { // 如果使用了cc.instantiate创建的结点会拷贝原来的事件
            btnComp.clickEvents.length = 0;
        }
        else {
            btnComp = btnNode.addComponent(Button);
            btnComp.transition = Button.Transition.SCALE;
            btnComp.duration = 0.1;
            btnComp.zoomScale = 0.9;
            btnComp.target = btnNode;
        }
        btnComp.clickEvents.push(eventHandler);
    }
}
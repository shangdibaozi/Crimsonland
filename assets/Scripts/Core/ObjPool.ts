import { instantiate, Node, Prefab, resources } from "cc";

export enum NODE_TYPE {
    BULLET_PISTAL = 'Bullet_A',
    MONSTER = 'Skeleton_01'
}

export class ObjPool {

    private static _pools: Map<string, Node[]> = new Map();
    private static prefabs: Map<string, Prefab> = new Map();

    static loadPrefabs() {
        return new Promise<boolean>((resolve, reject) => {
            resources.loadDir('ObjPrefabs', Prefab, (err: Error | null, prefabs: Prefab[]) => {
                if(err) {
                    reject(false);
                }
                else {
                    prefabs.forEach(prefab => {
                        this.prefabs.set(prefab.data.name, prefab);
                    });
                    resolve(true);
                }
            });
        });
    }

    static getNode(nodeName: string, active: boolean, parent: Node) {
        if(!this._pools.has(nodeName)) {
            this._pools.set(nodeName, []);
        }
        let lst = this._pools.get(nodeName)!;
        let node!: Node;
        if(lst.length === 0) {
            node = instantiate(this.prefabs.get(nodeName)!);
        }
        else {
            node = lst!.pop()!;
        }
        node.active = true;
        node.parent = parent;
        return node;
    }

    static putNode(node: Node) {
        node.active = false;
        this._pools.get(node.name)!.push(node);
    }
}
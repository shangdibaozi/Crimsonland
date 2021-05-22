import { instantiate, Node, Prefab, resources } from "cc";
import { Util } from "../Util";

export enum NODE_TYPE {
    BULLET_PISTAL = 'Bullet_A',
    MONSTER = 'Skeleton_01',
    GUN_ROCKET = 'Rocket'
}

export class ObjPool {

    private static _pools: Map<string, Node[]> = new Map();
    private static prefabs: Map<string, Prefab> = new Map();

    private static prefabType: Map<string, Prefab[]> = new Map();

    private static load(folder: string) {
        return new Promise<boolean>((resolve, reject) => {
            resources.loadDir(`Prefabs/${folder}`, Prefab, (err: Error | null, prefabs: Prefab[]) => {
                if(err) {
                    reject(false);
                }
                else {
                    prefabs.forEach(prefab => {
                        this.prefabs.set(prefab.data.name, prefab);
                    });
                    this.prefabType.set(folder, prefabs);
                    resolve(true);
                }
            });
        });
    }

    static async loadPrefabs() {
        await this.load('Effects');
        await this.load('Guns');
        await this.load('Monsters');
        await this.load('Bullets');
    }

    static getNode(nodeName: string, prefab: Prefab | null = null) {
        if(!this._pools.has(nodeName)) {
            this._pools.set(nodeName, []);
        }
        let lst = this._pools.get(nodeName)!;
        let node!: Node;
        if(lst.length === 0) {
            node = instantiate(prefab || this.prefabs.get(nodeName)!);
        }
        else {
            node = lst!.pop()!;
        }
        return node;
    }

    static putNode(node: Node) {
        if(this._pools.get(node.name)!.indexOf(node) >= 0) {
            debugger;
        }
        node.active = false;
        this._pools.get(node.name)!.push(node);
    }

    static get guns() {
        return this.prefabType.get('Guns')!;
    }

    static getRandomGun() {
        return this.getNode(Util.randomChoice(this.guns).data.name);
    }
}
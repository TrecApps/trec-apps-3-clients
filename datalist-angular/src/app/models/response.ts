export class ResponseObj {
    status: number;
    message: string;
    objId: string | undefined;

    constructor(s: number, m: string, o?: string){
        this.message = m;
        this.status = s;
        if(o){
            this.objId = o;
        }
    }
}
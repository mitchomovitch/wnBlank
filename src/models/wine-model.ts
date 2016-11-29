import { PriceModel } from './price-model';
export class WineModel {
    public id:string;
    public time:number;
    public userId:string;
    public userPseudo:string;
    public isShared:boolean;
    public isToDelete:boolean;
    public isPro:boolean;
    public isChanged:boolean;
    public isPhotoChanged:boolean;

    public nom: string;
    public codebarre: string;
    public millesime: string; 
    public producteur:string;
    public appellation:string;
    public subdivision:string;
    public region:string;
    public pays:string;
    public color:string;

    public lastPrice:PriceModel;
    public minPrice:PriceModel;
    public gammePrix:string;

    public lastNote:string;
    public lastNoteTime:number;
    public lastNoteUserId:string;
    public lastNotePseudo:string;

    public lastMsg:string;
    public lastMsgTime:number;
    public lastMsgUserId:string;
    public lastMsgPseudo:string;

    public latlng:string;
    public score:number;
    public scoreAvg:number;
    public nbLike:number;
    public nbPointToUpdate:number;

    public photoName:string;
    public photoUrl:string;    
    public photoPath:string;
    
    constructor(){ 
        
    } 
}
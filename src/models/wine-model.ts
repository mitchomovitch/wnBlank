export class WineModel {
    public id:string;
    public time:number;
    public userId:string;
    public userPseudo:string;
    public isShared:boolean;
    public isToDelete:boolean;

    public nom: string;
    public codebarre: string;
    public millesime: string; 
    public producteur:string;
    public appellation:string;
    public subdivision:string;
    public region:string;
    public color:string;
    
    public prixMin: string;
    public timePrixMin:number;
    public prixLast: string; 
    public timePrixMax:number;

    public note:string;

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
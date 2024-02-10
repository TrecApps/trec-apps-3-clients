export class BrandInfo {
    brandId: String;
    name: String;

    resourceTypePrimary: String = "";

    constructor(brandId: String, name: String, resourceTypePrimary: String | undefined){
        this.brandId = brandId;
        this.name = name;
        if(resourceTypePrimary){
            this.resourceTypePrimary = resourceTypePrimary;
        }
    }
}
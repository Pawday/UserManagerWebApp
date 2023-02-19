class TypeTools
{
    //https://stackoverflow.com/questions/951483/how-to-check-if-a-json-response-element-is-an-array
    static IsArray(object: any): boolean
    {
        return Object.prototype.toString.call(object) === '[object Array]';
    }
}

export default TypeTools;
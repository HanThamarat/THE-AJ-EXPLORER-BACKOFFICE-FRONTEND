
export class BASE64_CONVERTION {
    static async toBase64(file: File) {
        return new Promise<string>((resolve, reject) => {
             const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    }
}
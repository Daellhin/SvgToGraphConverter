export function download(content: BlobPart, fileName: string, contentType: any) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

export function isEventByKey(event: KeyboardEvent, key: string, callback: () => void) {
    if (event.key === key) {
        callback()
    }
}

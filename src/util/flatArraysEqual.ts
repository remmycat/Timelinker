export default function flatArraysEqual<T>(oldArray: T[], newArray: T[]) {
    return (
        oldArray.length === newArray.length &&
        oldArray.every((item, index) => item === newArray[index])
    );
}

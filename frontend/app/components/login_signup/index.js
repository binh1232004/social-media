'use client'
export function InputText({onChangeEvent, labelInputText}){
    return (
        <input 
            placeholder={labelInputText}
            type="text" 
            onChange={onChangeEvent}
            className="p-3 rounded-md outline-none w-full"

        />
    )
}
export function InputPassword({onChangeEvent, labelInputPassword}){
    return (
        <input 
            placeholder={labelInputPassword}
            type="password" 
            onChange={onChangeEvent} 
            className="p-3 rounded-md outline-none w-full"
        />
    )
}
export function InputSubmit ({submitEvent, submitLabel}) {
    return (
        <input 
            type="submit" 
            onSubmit={submitEvent} 
            value={submitLabel} 
            className="p-3 rounded-md bg-orange-300 w-full cursor-pointer outline-none text-white"
        />
    )
}
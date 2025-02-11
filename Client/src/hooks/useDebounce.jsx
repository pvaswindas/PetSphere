import { useRef, useEffect } from "react";
import { debounce } from "lodash";


const useDebounce = (callback, delay) => {
    const debouncedCallback = useRef(debounce(callback, delay))

    useEffect(() =>  {
        const currentDebounced = debouncedCallback.current
        return () => {
            currentDebounced.cancel()
        }
    }, [delay])

    return debouncedCallback.current
}

export default useDebounce
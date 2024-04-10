import { useDebugValue,useSyncExternalStore } from "react";

export function useOnlinestatus(){
const isonline = useSyncExternalStore(subscribe,() => navigator.onLine,()=>true)
useDebugValue(isonline ? 'Online' : 'Offline');
return isonline;
}

function subscribe(callback) {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }
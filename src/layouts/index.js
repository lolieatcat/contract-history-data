import { useState } from 'react';
import styles from './index.css';
import Web3 from 'web3';
import { useLocalStorageState } from 'ahooks';

function BasicLayout(props) {
  const [scAddress, setScAddress] = useLocalStorageState('address');
  const [abi, setAbi] = useLocalStorageState('abi');
  const [blockNumber, setBlockNumber] = useLocalStorageState('block');
  const [retVal, setRetVal] = useLocalStorageState('ret');
  const [method, setMethod] = useLocalStorageState('method');
  const [param, setParam] = useLocalStorageState('param');
  const [rpcUrl, setRpcUrl] = useLocalStorageState('rpcUrl', 'https://gwan-ssl.wandevs.org:56891')
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Contract Historical Data</h1>

      <h3>RPC URL:</h3>
      <input style={{width:"400px"}} value={rpcUrl} onChange={e=>setRpcUrl(e.target.value)} />

      <h3>Contract Address:</h3>
      <input style={{width:"400px"}} value={scAddress} onChange={e=>setScAddress(e.target.value)} />

      <h3>ABI:</h3>
      <textarea rows="10" cols="60" value={abi} onChange={e=>setAbi(e.target.value)} />

      <h3>BlockNumber:</h3>
      <input value={blockNumber} onChange={e=>setBlockNumber(e.target.value)} />

      <h3>Call Method:</h3>
      <input value={method} onChange={e=>setMethod(e.target.value)}/>

      <h3>Parameters:</h3>
      <input value={param} onChange={e=>setParam(e.target.value)}/>

      <div />
      <button style={{margin:"20px", width:"120px"}} onClick={()=>{
        setRetVal('');
        let abiObj;
        try {
          abiObj = JSON.parse(abi);
        } catch (error) {
          console.error(error);
          return;
        }

        if (!abiObj || !blockNumber || !scAddress || !method) {
          return;
        }

        let web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
        
        let sc = new web3.eth.Contract(abiObj, scAddress);

        if (!param || param.length === 0) {
          sc.methods[method.toString()]().call(undefined, blockNumber).then(ret=>setRetVal(JSON.stringify(ret, null, 2))).catch(ret=>setRetVal(JSON.stringify(ret, null, 2)));
        } else {
          sc.methods[method.toString()](...param.split(',')).call(undefined, blockNumber).then(ret=>setRetVal(JSON.stringify(ret, null, 2))).catch(ret=>setRetVal(JSON.stringify(ret, null, 2)));
        }

      }}>Read</button>

      <h3>Return:</h3>
      <textarea rows="10" cols="60" value={retVal} readOnly />
    </div>
  );
}

export default BasicLayout;

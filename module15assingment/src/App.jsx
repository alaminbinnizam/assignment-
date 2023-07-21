import React from 'react';
import { useState } from 'react';

const App = () => {
  const [list,setList]=useState([])
  const [item,setItem]=useState("")
const AddToList=()=>{
  if(item !==""){
    list.push(item)
    setList([...list])
    setItem('')
  }else{
    alert('Not empty')
  }
   
}
const ItemRemove=(index)=>{
  list.splice(index,1)
  setList([...list])
}  
  return (
    <div>
        <div className="container  px-4 ">
          <div className='bg-white w-96 rounded mx-auto my-10 drop-shadow-lg p-2'>
              <h1 className='text-center py-5 font-semibold'>To Do List App</h1>
              <input onChange={(e)=>setItem(e.target.value)} value={item} className='bg-white appearance-none border-2 border-gray-200 rounded w-60 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="text" placeholder='Add Item' />
              <button onClick={AddToList} className="px-8 py-2 ml-2 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Add</button>
             
          </div>
            <table className='table-auto mx-auto'>
            <thead>
              <tr>
                <th className='border px-4 py-2'>Item</th>
                <th className='border px-4 py-2'>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                list.length!==0?(
                  list.map((element,index)=>{
                      return(
                        <tr key={index}>
                          <td className='border px-4 py-2'>{element}</td>
                          <td onClick={()=>{
                            ItemRemove(index)
                          }}
                           className='border px-4 py-2'><button className='px-8 py-2 ml-2 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'>Remove</button></td>
                        </tr>
                      )
                  })
                ):(<tr></tr>)
              }
            </tbody>
            </table>
        </div>
    </div>
  );
};

export default App;
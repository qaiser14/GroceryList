import React, { useState, useEffect} from 'react';
import Alert from './Alert';
import List from './List';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
    if(list) {
      return(list = JSON.parse(localStorage.getItem('list')));
    } else {
      return [];
    }
};


function App(){

  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({show: false, msg: '', type: ''});
  const [list, setList] = useState(getLocalStorage());
  const [editID, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name) {
      showAlert(true, 'Danger', 'Please enter value');
    } else if ( name && isEditing ) {
      setList(
        list.map((item) => {
          if(item.id === editID){
            return{ ...item, title: name }
          }
          return item;
        })
      );
      setName('');
      setEditId(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value changed');
    } else {
      showAlert(true, 'success', 'item added to the list');
      const newItem = {id: new Date().getTime().toString(), title: name };
      setList([...list, newItem])
      setName('');
    }
  };

  const showAlert = (show = false, type = '', msg = '' ) => {
      setAlert({show, type, msg})
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => id === item.id)
     setIsEditing(true);
     setEditId(id);
     setName(specificItem.title);
  };

  const removeItem = (id) => {
    showAlert(true, 'Danger', 'item removed');
    setList(list.filter((item) => item.id !== id )
  )};

  const clearList = () => {
    showAlert(true, 'Danger', 'list cleared');
    setList([]);
  }

  useEffect(() => {
      localStorage.setItem('list', JSON.stringify(list));
    }, [list]
  );


  return(
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}

          <h3>grocery bud</h3>
          <div className='form-control'>
            <input
              type='text'
              className='grocery'
              placeholder='e.g. eggs'
              value={name}
              onChange={(e) => setName(e.target.value)} 
            />
            
            <button type='submit' className='submit-btn'>
                {isEditing ? 'edit' : 'submit'}
            </button>
          </div>
      </form>

        {list.length > 0 && ( 
          <div className='grocery-container'>
              <List items={list} editItem={editItem} removeItem={removeItem}/>
              <button className='clear-btn' onClick={clearList}>
                clear items
              </button>
          </div>
          )}
      
    </section>
  );
}

export default App;



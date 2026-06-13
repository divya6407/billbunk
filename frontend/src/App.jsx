
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import CreateGroup from './pages/CreateGroup.jsx';
import ViewGroup from './pages/ViewGroup.jsx';
import { CreateExpense } from './pages/CreateExpense.jsx';
import { EditExpense } from './pages/EditExpense.jsx';
import { Notification } from './pages/Notification.jsx'
export default function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes >
          <Route path='/' element={<h1>Home page</h1>} />
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/join' element={<CreateGroup/>}></Route>
          <Route path='groups/:grpid' element={<ViewGroup/>}></Route>
          <Route path='expenses/new/:grpid' element={<CreateExpense/>}></Route>
          <Route path='expenses/:expid' element={<EditExpense/>}></Route>
          <Route path='notifications/' element={<Notification/>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
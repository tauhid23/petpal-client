import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import Pets from "./pages/Pets";
import AddPet from "./pages/AddPet";
import CalendarPage from "./pages/CalenderPage";
import MyPets from "./pages/MyPets";


function App() {
  return (
    <>
      <Navbar />
      <div className=" w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<MyPets/>} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/calender" element={<CalendarPage/>} />
        </Routes>
      </div>
    </>
  );
}

export default App;

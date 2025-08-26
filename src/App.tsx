import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddPet from "./pages/AddPet";
import CalendarPage from "./pages/CalenderPage";
import MyPets from "./pages/MyPets";
import EditPetForm from "./components/EditPetForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { useAuth } from "./context/AuthContext";

function App() {
  const { loading } = useAuth(); // <-- Get the loading state

  if (loading) {
    return <div>Loading...</div>; // <-- Show a loading spinner or screen
  }

  return (
    <>
      <Navbar />
      <div className="w-full">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cal" element={<ProtectedRoute><CalendarPage/></ProtectedRoute>}/>

          {/* Protected */}
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <MyPets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-pet"
            element={
              <ProtectedRoute>
                <AddPet />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/calendar"
            element={
              
                <CalendarPage />
              
            }
          /> */}
          <Route
            path="/edit-pet/:id"
            element={
              <ProtectedRoute>
                <EditPetForm />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

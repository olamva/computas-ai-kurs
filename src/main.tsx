import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AgeCheck from "./routes/AgeCheck"
import Farm from "./routes/Farm"
import Menu from "./routes/menu/Menu"
import "./styles.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route
          path="/farm"
          element={
            <AgeCheck>
              <Farm />
            </AgeCheck>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

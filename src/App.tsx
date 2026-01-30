import './App.css';
import { Game } from './components/Game';

function App() {
  return (
    <div className="app">
      <h1>Sliding Block Puzzle</h1>
      <p>Click on an arrow block to remove it from the board. Clear the board to win!</p>
      <Game />
    </div>
  );
}

export default App;

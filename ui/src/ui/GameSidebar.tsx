import './GameSidebar.css';
import { useHistory } from "react-router-dom";
function GameSidebar() {
    const history = useHistory();

    const routeChange = () => {
        history.push('/');
    }
    return (
        <>

            <div className="game-sidebar-container">

                <div>
                    <button onClick={routeChange}>
                        Home
                    </button>
                </div>
            </div>
        </>

    );

}

export default GameSidebar;
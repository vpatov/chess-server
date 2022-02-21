import Board from '../board/Board';
import CreateGame from './createGame/CreateGame';
import GameSidebar from './gamePlaySidebar/GamePlaySidebar';
import './Sidebar.css'

export const enum SidebarMode {
    GAME_SIDEBAR,
    CREATE_GAME
}

const sidebarComponents = {
    [SidebarMode.GAME_SIDEBAR]: GameSidebar,
    [SidebarMode.CREATE_GAME]: CreateGame,
};

function Sidebar(props: any) {
    const sidebarMode: SidebarMode = props.sidebarMode;
    const SidebarComponent = sidebarComponents[sidebarMode];

    return (
        <div className="sidebar">
            <SidebarComponent></SidebarComponent>
        </div>
    );
}

export default Sidebar;

import { clientPlayingWhiteSelector } from "../../store/selectors";
import { useSelector } from 'react-redux';
import './Board.scss';


function FilesLabel() {
    const clientPlayingWhite = useSelector(clientPlayingWhiteSelector);

    const fileCharacters = 'abcdefgh';
    const files = [...(
        clientPlayingWhite ?
            fileCharacters :
            fileCharacters.split('').reverse().join('')
    )];
    return (
        <div className="files-label">
            {files.map((file) => <span className="file-label">{file}</span>)}
        </div>

    )
}

export default FilesLabel;


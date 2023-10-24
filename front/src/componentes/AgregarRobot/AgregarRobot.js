import {sendDataRobot, modifyName, modifyAvatar, modifyConfig} from '../../store/robots/actions';
import {connect} from 'react-redux';

const UserRobotCreate = ({sendDataRobot, modifyName, modifyAvatar, modifyConfig}) => {
    return (
        <div id="create-robot">
            <h1>Create Robot</h1>
            <form id="form-robot">
                <div id="input-nombre-robot">
                    <h2>Nombre del Robot</h2>
                    <input className="input-label-nombre" type="text" placeholder="Nombre del Robot" name= "nameValue"
                        onChange={(e) => modifyName(e.target.value)} />
                </div>
                <div id="input-avatar-robot">
                    <h2>Subir AvatarRobot</h2>
                    <input className="input-file-img" type="file" multiple={ false } accept="image/*" name= "avatar"
                        onChange={(e) => modifyAvatar(e.target.files[0])} />
                </div>
                <div id="input-codigo-robot">
                    <h2>Subir codigo python del Robot</h2>
                    <input className="input-file-file" type="file" multiple={ false } accept=".py" name= "config"
                        onChange={(e) => modifyConfig(e.target.files[0])} />
                </div>
                <div id='robot-submit'>
                    <input type="button" onClick={() => sendDataRobot()} value="Submit" className='input-submit'/>
                </div>
            </form>
        </div>
    );
}
export default connect(null, {sendDataRobot, modifyName, modifyAvatar, modifyConfig})(UserRobotCreate);
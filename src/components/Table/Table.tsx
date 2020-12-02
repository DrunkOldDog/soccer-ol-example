import React from 'react'
import { PlayerInterface } from './types'
import './table.scss';
import { dummyPlayers } from '../../common/dummy/dummies';

const Table = () => {
  return (
    <table>
      <thead>
        <tr>
          <th className="image-header"></th>
          <th align="left">Player</th>
          <th align="left">Nº</th>
        </tr>
      </thead>

      <tbody>
        {dummyPlayers.map((player: PlayerInterface) => (
          <tr key={player.playerId}>
            <td><img src={player.playerImage} alt="p" /></td>
            <td className="player-name-cell">
                <span>{player.playerFirstName || '-'}</span>
                <p>{player.playerLastName}</p>
            </td>
            <td className="player-number-cell">#{player.playerNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table;

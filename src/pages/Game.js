
import React, {useEffect, useRef, useState } from 'react';
import Chess from 'chess.js';
import '../style.css';
import { Chessboard } from 'react-chessboard';


import NFTCheck from '../modules/randomFunctions/NFTCheck';
import ModalService from '../modules/modals/modal components/ModalService';
import AddModal from '../modules/modals/modal components/AddModal';
import LoadingModal from '../modules/modals/modal files/LoadingModal';
import io from 'socket.io-client';

const socket = io('http://localhost:6100',{autoConnect:true})





export default function Game({ gametoapp },{ boardWidth }) {

  //socket
 

    
  


  ////////////////////////

   
  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  // const [playerColor, setPlayerColor] = useState("white");
  // const [playerTurn, setPlayerTurn] = useState("white");
  const [boardOrientation, setBoardOrientation] = useState('white');
  const [currentTimeout, setCurrentTimeout] = useState(undefined);

  const [moveFrom, setMoveFrom] = useState('');
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});

    //score logic
    const [win, setWin] = useState("")
    const [stalemate, setStalemate] = useState("")
    const [gameResult, setGameResult] = useState("")

    // useEffect(()=>{
    //   ModalService.playerColor = playerColor;
    //   ModalService.playerTurn = playerTurn;
    //   ModalService.boardOrientation = boardOrientation;
    // },[boardOrientation])

    // useEffect(()=>{
    //   if (game.turn() === 'w'){setPlayerTurn("White")}
    //   if (game.turn() === 'b'){setPlayerTurn("Black")}
    //   if (boardOrientation === "white") {setPlayerColor("White")}
    //   if (boardOrientation === "black"){setPlayerColor("Black")}
    //   let inCheck = document.getElementById("inCheck");
    //   if (game.in_check() === true && game.turn() === 'b'){inCheck.textContent = 'Black in Check'}
    //   if (game.in_check() === true && game.turn() === 'w'){inCheck.textContent = 'White in Check'}
    //   if (!game.in_check()){inCheck.textContent = 'Not in Check'}

    // },[boardOrientation, game])

    
    
   
 
    
    useEffect(()=>{
      //win/loss
      if (game.in_checkmate() === true) {
        let playerInCheckmate = game.turn()
        if (playerInCheckmate === "b") {
          setWin(true)
          console.log("white wins")
        }
        if (playerInCheckmate === "w") {
          setWin(false)
          console.log("black wins")
        }
  
        console.log(`${playerInCheckmate} in checkmate`)
      }
  //stalemate
      if (game.in_stalemate() | game.in_draw() === true) {

        setStalemate(true)
      
        console.log("in stalemate ", stalemate)
      }
     
    },[game, gameResult])

    //send gameresult to app.js
    useEffect(()=>{
      if (win === true){setGameResult("win")}
      if (win === false){setGameResult("loss")}
      if (stalemate === true){setGameResult("stalemate")}
      if (gameResult === "" || "win" ||  gameResult ===  "loss" || gameResult === "stalemate") {gametoapp(gameResult)}
    },[game, win, stalemate, gameResult])

    useEffect(()=>{
      socket.emit("move", game.fen())
      console.log(game.fen())
     
    },[game])


    
    
  
    function safeGameMutate(modify) {
      setGame((g) => {
        const update = { ...g };
        modify(update);
        return update;
      });
    }
    function getMoveOptions(square) {
      const moves = game.moves({
        square,
        verbose: true
      });
      if (moves.length === 0) {
        return;
      }
  
      const newSquares = {};
      moves.map((move) => {
        newSquares[move.to] = {
          background:
            game.get(move.to) && game.get(move.to).color !== game.get(square).color
              ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
              : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
          borderRadius: '50%'
        };
        return move;
      });
      newSquares[square] = {
        background: 'rgba(255, 255, 0, 0.4)'
      };
      setOptionSquares(newSquares);
      socket.emit('move', game.move())
    }
   
  
  
    function onSquareClick(square) {
      setRightClickedSquares({});
  
      function resetFirstMove(square) {
        setMoveFrom(square);
        getMoveOptions(square);
      }
  
      // from square
      if (!moveFrom) {
        resetFirstMove(square);
        return;
      }
  
      // attempt to make move
      const gameCopy = { ...game };
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: 'q' // always promote to a queen for example simplicity
      });
      setGame(gameCopy);
  
      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        resetFirstMove(square);
        return;
      }
  
     
      setMoveFrom('');
      setOptionSquares({});
    }
  

    ////Move logger is rendered
  
    function FenLogger (){
        //initialize move content
        useEffect(()=>{
            
            const newMove = game.history()
            const parseMove = JSON.stringify(newMove)
            const logMove = parseMove
          if (null) { document.getElementById('fenlogger').innerHTML = 'Make a move...' }
        else {document.getElementById('fenlogger').innerHTML = logMove}
        
       },[])       
        return (
            <div id="fenlogger"></div>
            )}

     //////chessborder is rendered
     const [hasNFT, setHasNFT] = useState(false);
     useEffect(() => {
       console.log(hasNFT)
       setHasNFT(true)
      console.log(hasNFT)
     }, [ModalService.hasNFT]);
     if(!ModalService.popped) {AddModal(LoadingModal)}
 if(hasNFT)
 
     {return (
         <div id="gameContainer">
           <div id="lobbyBar">
             <button className="btn btn-primary" id="joinLobby" onClick={()=>{AddModal(LoadingModal)}}>Join Lobby</button>


           </div>
       <div id="boardContainer">
         <Chessboard
           id="myboard"
           animationDuration={200}
           arePiecesDraggable={false}
           boardOrientation={boardOrientation}
           boardWidth={boardWidth}
           position={game.fen()}
           onSquareClick={onSquareClick}
           customBoardStyle={{
             borderRadius: '4px',
             boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
           }}
           customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares
          }}
           ref={chessboardRef}
         />
         <FenLogger />
         </div>
           <div id="boardBtnContainer"> <button id="boardBtn"
           className="rc-button"
           onClick={() => {
             safeGameMutate((game) => {
               game.reset();
               setGameResult("")
               setWin("")
               setStalemate("")
             });
             // stop any current timeouts
             clearTimeout(currentTimeout);
           }}
         >
           reset
         </button>
 
         <button id="boardBtn"
           className="rc-button"
           onClick={() => {
             safeGameMutate((game) => {
               game.undo();
             });
             // stop any current timeouts
             clearTimeout(currentTimeout);
           }}
         >
           undo
         </button></div>
 
       </div>
       
     );}
     if(!hasNFT){
       return(
         <div><div>Get the freaking NFT</div>
         <button onClick={()=>NFTCheck()}>Get NFT</button><div>{hasNFT}</div></div>
       )
     }
   }

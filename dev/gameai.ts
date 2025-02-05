/// <reference path="knight.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate
    
    public static moveKnight(king:King, knights: Knight[], gameState:GameState) {
        let t0 = performance.now();                                                                                         //Start tijd van minimax. 

        const searchdepth = 5;
        let minEval = +Infinity;
        let bestMove: [number,number] = [0,0];                                                                              //Een array met 2 nummers.
        let indexKnight = 0;
        
        //Loop voor iedere Knight. 
        for(let i=0; i<knights.length; i++){
            const KnightlegalMoves = knights[i].getMoves(gameState.knightPositions[i]);                                     //De legale moves die de knight op de momentele positie kan maken. 

            for(let move of KnightlegalMoves){                                                                              //Loop door alle moves van de gekozen knight heen. 
                const gamestateCopy = gameState.copy();                                                                     //Maak een nep kopie van de gameState (zodat je alle moves niet in het echt doet)
                gamestateCopy.knightPositions[i] = move;                                                                    //Voer de gekoze move uit op de gekoze knight in de nep-gamestate.

                const Eval = this.miniMax(gamestateCopy, king, knights, searchdepth -1, false);                             //Neem de gekoze positie mee naar de minimax. 
                                                                                                                            //Currenteval is altijd nul als je loopt of als je verliest. 
                //Als gereturnde cijfer kleiner is dan +Infinity
                if (Eval < minEval){
                    minEval = Eval;                                                                                         //De waarde van Infinity veranderd naar de berekende cijfer van de minimax
                    bestMove = move;                                                                                        //De nieuwe bestMove krijgt de waarde van de move met het hoogste cijfer.
                    indexKnight = i;                                                                                        //De indexKnight krijgt de waarde van de beste knight. 
                }
            }
        }
        
        //Play the best chosen move
        knights[indexKnight].setPosition(bestMove);                                                                        //Zet de positie van de knight met de bestemove. 
        gameState.knightPositions[indexKnight] = bestMove;                                                                 //Update de gamestate, zodat die weet wat de laatst gedaande move was.                  

        //Hou bij hoelang het berekenen duurde
        let t1 = performance.now();
        console.log("AI move took " + (t1 - t0) + " milliseconds to calculate.");
    }

    public static miniMax(gameState: GameState, king:King, knights: Knight[], depth: number, maximizingPlayer: boolean){
        const score = gameState.getScore();

        //Als dept 0 is of als score false is;
        if (depth === 0 || score[1]){                                                                                       //Als het 1 is dan returned die de boolean "false" of "true", is het spel over in de current positie?
            return score[0];                                                                                                //Als het 0 is dan returnd die de eerste score in zijn array
        }

        //Kingzet
        if (maximizingPlayer){
            let maxEval = -Infinity;
            const gamestateCopy = gameState.copy(); 
            const KingLegalMoves = king.getMoves(gamestateCopy.kingPos)                                                     //Haal de huidige situatie van je King op (welke moves kan die? )
            
            for (let move of KingLegalMoves){                                                                               //Loop door alle posities die je kan halen binnen 1 king move.         
                gamestateCopy.kingPos = move;                                                                               //Doe alsof je de move uitvoerd. 

                const currentEval = this.miniMax(gamestateCopy, king, knights, depth -1, false);                            //0, -100, 100
                maxEval = Math.max(maxEval, currentEval);                                                                   //Kies de hoogste nummer
            }
            return maxEval;
        }

        //Knight
        else {
            let minEval = Infinity;

            for(let i=0; i<knights.length; i++){
                const gamestateCopy = gameState.copy();
                const KnightlegalMoves = knights[i].getMoves(gamestateCopy.knightPositions[i]);                             //Alle moves die de knight in de copy van de gameState kan maken. 

                for(let move of KnightlegalMoves){                                                                          //Loop door alle moves van die 1ne knight heen.
                    gamestateCopy.knightPositions[i] = move;                                                                //Doe alsof je die move uitvoerd. 

                    const currentEval = this.miniMax(gamestateCopy, king, knights, depth -1, true);                         //0, -100 of 100
                    minEval = Math.min(minEval, currentEval);                                                               //Kies de laagste nummer
                }
            };
            return minEval;
        }
    }
}
/**
 *  Author: Shohel Shamim
 *  Release Date: 05-08-2012
 *  Linnaeus University, Växjö, Sweden
 */
$(document).ready(function() {
    game();

    function game() {
        if (supports_local_storage) {
            var deck = new Array();
            var cardsImagePosHuman = new Array();
            var leftPlayerCards = new Array();
            var middlePlayerCards = new Array();
            var rightPlayerCards = new Array();
            var humanPlayerCards = new Array();
            var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
            var names = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"];
            var selectedCharecters = ["1.png", "2.png", "3.png", "4.png", "4.png", "6.png", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png"];
            var $div = $("#buttom");
            var gameSettings;
            var currentPosition = 0;
            var isLeftSideOff = false;
            var isRightSideOff = false;
            var isMiddleSideOff = false;
            var isHumanSideOff = false;
            var leftBid = 0;
            var rightBid = 0;
            var middleBid = 0;
            var humanBid = 0;
            var remainedSpades = 0;
            //Who played the card according to the current position, Anticlockwise: right=1, top=2, left=3, human=4
            //Default current position
            var currentPlayer = 0;
            //How many cards on the table
            var currentCardPlayed = 0;
            //Game Round is Maxed to 13
            var gameRound = 0;
            var currentTable;
            //Delayed time for each card visible
            var timer = 750;
            var restart = false;
            var rightPlayersCardsClass;
            var middlePlayersCardsClass;
            var leftPlayersCardsClass;
            var humanPlayersCardsClass;
            var rightPlayerScore = new PlayerScore();
            var middlePlayerScore = new PlayerScore();
            var leftPlayerScore = new PlayerScore();
            var humanPlayerScore = new PlayerScore();
            /**
             *It has 6 row, first 4 will contains  each suit number for side off, 5th will contain has spade: as 5 and 6th will contain 6 as honors card.
             * Default value will be [0,0,0,0,0,0] in every new card destribution.
             */
            var leftPlayerStatus = new Array();
            var rightPlayerStatus = new Array();
            var middlePlayerStatus = new Array();
            var humanPlayerStatus = new Array();
            /* ---------------------------------- */
            var isHumanCardClicked = false;
            var rightTablesCard;
            var leftTablesCard;
            var middleTablesCard;
            var humanTablesCard;
            //For each round's result's will be decided by below values
            var firstPlayedSuite = 0;
            var whoPlayedHighCard = 0;
            var valueOfHighCard = 0;
            var sortedNumberOfHighCard = 0;
            var anySpadesPlayed = false;
            //----------------------------------------------------

            /************Four Players Card Images********************/
            $("#dealButton").hide();
            $("#quitButton").hide();
            $("#container").hide();
            $("#restart_button").hide();

            $("#newGameButton").click(function() {
                try {
                    shuffle(selectedCharecters);
                    currentPosition = 0;
                    $(".history_div").fadeOut(1000);
                    $("#left_player").show();
                    $("#right_player").show();
                    $("#middle_player").show();
                    $("#settings").slideToggle("slow");
                    $("#table_title_tx").focus();
                } catch(e) {
                    console.log("Error in newGameButton.click: " + (e && e.message) || e.toString());
                }
            });

            $("#game_setting_button").click(function() {
                try {
                    $(".history_div").fadeOut(1000);
                    var $title = $("#table_title_tx");
                    var $human = $("#human_player_name");
                    var $left = $("#left_player_name");
                    var $middle = $("#middle_player_name");
                    var $right = $("#right_player_name");

                    if ($title.val() == "") {
                        $title.css("background", "yellow");
                        $title.focus();
                    } else if ($human.val() == "") {
                        $human.css("background", "yellow");
                        $human.focus();
                    } else if ($left.val() == "") {
                        $left.css("background", "yellow");
                        $left.focus();
                    } else if ($middle.val() == "") {
                        $middle.css("background", "yellow");
                        $middle.focus();
                    } else if ($right.val() == "") {
                        $right.css("background", "yellow");
                        $right.focus();
                    } else {
                        getGameSettings();
                        $("#settings").slideToggle("slow");
                        $("#dealButton").fadeIn();
                        $("#quitButton").fadeIn();
                        $("#container").fadeIn();
                        $("#newGameButton").fadeOut();
                        $("#top-left").hide();
                        $("#top-middle").hide();
                        $("#top-right").hide();

                        //game: value means has saved game
                        localStorage.setItem('game', 0);
                        if (localStorage.getItem('currentPosition')) {
                            localStorage.removeItem('currentPosition');
                        }

                        bidPopupMenuOptions();
                        setCharecters();
                        initialize();
                        gameInit();

                        $("#game_title_with_tbl_name").html(gameSettings.name);
                        $("#max_poins_title").html("Max Game Points " + gameSettings.maxGamePoints);
                        $("#left_player_text_name").html(gameSettings.left);
                        $("#middle_player_text_name").html(gameSettings.middle);
                        $("#right_player_text_name").html(gameSettings.right);
                        $("#name_of_human").html(gameSettings.human);
                        $("#name_of_middle").html(gameSettings.middle);
                        $("#name_of_left").html(gameSettings.left);
                        $("#name_of_right").html(gameSettings.right);
                    }
                } catch(e) {
                    console.log("Error in gameSetting.click: " + (e && e.message) || e.toString());
                }
            });

            $("#dealButton").click(function() {
                try {
                    if (localStorage.getItem('game')) {
                        isLeftSideOff = false;
                        isRightSideOff = false;
                        isMiddleSideOff = false;
                        isHumanSideOff = false;
                        $("#left_player_text_sideoff").hide();
                        $("#right_player_text_sideoff").hide();
                        $("#middle_player_text_sideoff").hide();
                        $("#game_bid_menu").hide();
                        $("#top-left").fadeIn();
                        $("#top-middle").fadeIn();
                        $("#top-right").fadeIn();
                        $("#footer_current_total").hide();
                        $("#footer_current_player_name").hide();
                        $("#footer_human_player_warning").hide();
                        $(".history_div").fadeOut(1000);

                        resetCurrentBidAndScore();
                        currentTable = new Table();
                        rightPlayerScore.resetCurrentScoreAndBid();
                        middlePlayerScore.resetCurrentScoreAndBid();
                        leftPlayerScore.resetCurrentScoreAndBid();
                        humanPlayerScore.resetCurrentScoreAndBid();
                        gameInit();
                        gameStart();
                        $(this).fadeOut(1000);
                        $("#restart_button").fadeIn(1000);
                    } else {
                        alert("No game found, please start new game.");
                    }
                } catch(e) {
                    console.log("Error in dealButton.click: " + (e && e.message) || e.toString());
                }
            });

            $("#quitButton").click(function() {
                try {
                    $("#newGameButton").fadeIn();
                    $("#lastFiveGames").fadeIn();
                    $("#quitButton").fadeOut();
                    $("#dealButton").fadeOut();
                    $("#restart_button").fadeOut();
                    $("#container").fadeOut();
                    $("#game_bid_menu").fadeOut();
                    $(".history_div").fadeOut(1000);
                    removeLocalStorage();
                    deck = [];
                    location.reload();
                } catch(e) {
                    console.log("Error in quitButton.click: " + (e && e.message) || e.toString());
                }
            });

            $("#restart_button").click(function() {
                restart = true;
                $("#dealButton").trigger('click');
            });

            function setCharecters() {
                try {
                    $("#human_img").attr('src', "icons/" + selectedCharecters[0]);
                    $("#right_img").attr('src', "icons/" + selectedCharecters[1]);
                    $("#middle_img").attr('src', "icons/" + selectedCharecters[2]);
                    $("#left_img").attr('src', "icons/" + selectedCharecters[3]);
                } catch(e) {
                    console.log("Error in setCharecters(): " + (e && e.message) || e.toString());
                }
            }

            function resetCurrentBidAndScore() {
                try {
                    $("#curr_bid_left").html("-");
                    $("#curr_bid_right").html("-");
                    $("#curr_bid_middle").html("-");
                    $("#curr_bid_human").html("-");
                    $("#curr_score_left").html("-");
                    $("#curr_score_right").html("-");
                    $("#curr_score_middle").html("-");
                    $("#curr_score_human").html("-");
                } catch(e) {
                    console.log("Error in resetCurrentBidAndScore(): " + (e && e.message) || e.toString());
                }
            }

            function gameInit() {
                try {
                    currentCardPlayed = 0
                    gameRound = 0;
                    currentPlayer = 0;
                    leftPlayerCards = [];
                    rightPlayerCards = [];
                    middlePlayerCards = [];
                    humanPlayerCards = [];
                    $div.empty();
                    $("#right_card").hide();
                    $("#middle_card").hide();
                    $("#left_card").hide();
                    $("#human_card").hide();
                } catch(e) {
                    console.log("Error in gameInit(): " + (e && e.message) || e.toString());
                }
            }

            function gameStart() {
                try {
                    if (!restart) {
                        shuffle(deck);
                        localStorage.setItem('dealt_card', JSON.stringify(deck));
                        selectedPosition();
                    } else {
                        currentPosition = parseInt(localStorage.getItem('currentPosition'));
                        deck = [];
                        deck = JSON.parse(localStorage.getItem('dealt_card'));
                        selectedPosition();
                    }
                    restart = false;
                    sortPlayersDealtCard();
                    resetCardsImagePosHuman();
                    humanCards();
                } catch(e) {
                    console.log("Error in gameStart(): " + (e && e.message) || e.toString());
                }
            }

            function resetCardsImagePosHuman() {
                try {
                    var percent = 67.5;
                    for (var i = 0; i < 13; i++) {
                        cardsImagePosHuman[i] = percent;
                        percent -= 4;
                    }
                } catch(e) {
                    console.log("Error in resetCardsImagePosHuman(): " + (e && e.message) || e.toString());
                }
            }

            function initialize() {
                try {
                    var num = getRandom(4) + 1;
                    if (!localStorage.getItem('currentPosition')) {
                        localStorage.setItem('currentPosition', num);
                    }
                    createDeck();
                } catch(e) {
                    console.log("Error in initialize(): " + (e && e.message) || e.toString());
                }
            }

            function createDeck() {
                try {
                    var index = 0;
                    var sortNum = 1;
                    for (var suit = 0; suit < 4; suit++) {
                        for (var value = 0; value < 13; value++) {
                            var card = new Card(names[value], suits[suit], suit + 1, value + 2, sortNum++, (suit != 3) ? 0 : 1);
                            deck[index] = card;
                            index++;
                        }
                    }
                } catch(e) {
                    console.log("Error in createDeck(): " + (e && e.message) || e.toString());
                }
            }

            function shuffle(attr) {
                try {
                    var len = attr.length;
                    var i = len;
                    while (i--) {
                        var c = parseInt(Math.floor(Math.random() * len));
                        var d = attr[i];
                        attr[i] = attr[c];
                        attr[c] = d;
                    }
                } catch(e) {
                    console.log("Error in shuffle(): " + (e && e.message) || e.toString());
                }
            }

            /******************Card Destribution and Cards Properties Start********************/
            function selectedPosition() {
                try {
                    if (currentPosition == 0) {
                        currentPosition = parseInt(localStorage.getItem('currentPosition'));
                    } else {
                        if (restart) {
                            currentPosition = parseInt(localStorage.getItem('currentPosition'));
                        } else {
                            currentPosition++;
                        }
                    }
                    currentPosition = (currentPosition > 4) ? 1 : currentPosition;
                    cardDestribution(parseInt(currentPosition));

                    if (gameSettings.mustSpade == "on") {
                        while (!isSpades()) {
                            currentPosition -= 1;
                            gameStart();
                        }
                    }
                    if (gameSettings.honors == "on") {
                        while (!isHonors()) {
                            currentPosition -= 1;
                            gameStart();
                        }
                    }

                    currentPlayer = currentPosition;
                    localStorage.setItem('currentPosition', currentPosition);
                } catch(e) {
                    console.log("Error in selectedPosition(): " + (e && e.message) || e.toString());
                }
            }

            /**
             *Position
             *Anticlockwise: right=1, middle=2, left=3, human=4
             */
            function cardDestribution(pos) {
                try {
                    playersStatusForDealInit();
                    switch(pos) {
                        case 1:
                            for (var i = 0; i < 13; i++) {
                                rightPlayerCards[i] = deck[i];
                                middlePlayerCards[i] = deck[i + 13];
                                leftPlayerCards[i] = deck[i + 26];
                                humanPlayerCards[i] = deck[i + 39];
                                playersStatusForDealSet(humanPlayerCards[i], rightPlayerCards[i], middlePlayerCards[i], leftPlayerCards[i]);
                            }
                            break;

                        case 2:
                            for (var i = 0; i < 13; i++) {
                                middlePlayerCards[i] = deck[i];
                                leftPlayerCards[i] = deck[i + 13];
                                humanPlayerCards[i] = deck[i + 26];
                                rightPlayerCards[i] = deck[i + 39];

                                playersStatusForDealSet(humanPlayerCards[i], rightPlayerCards[i], middlePlayerCards[i], leftPlayerCards[i]);
                            }
                            break;

                        case 3:
                            for (var i = 0; i < 13; i++) {
                                leftPlayerCards[i] = deck[i];
                                humanPlayerCards[i] = deck[i + 13];
                                rightPlayerCards[i] = deck[i + 26];
                                middlePlayerCards[i] = deck[i + 39];

                                playersStatusForDealSet(humanPlayerCards[i], rightPlayerCards[i], middlePlayerCards[i], leftPlayerCards[i]);
                            }
                            break;

                        case 4:
                            for (var i = 0; i < 13; i++) {
                                humanPlayerCards[i] = deck[i];
                                rightPlayerCards[i] = deck[i + 13];
                                middlePlayerCards[i] = deck[i + 26];
                                leftPlayerCards[i] = deck[i + 39];

                                playersStatusForDealSet(humanPlayerCards[i], rightPlayerCards[i], middlePlayerCards[i], leftPlayerCards[i]);
                            }
                            break;
                    }
                } catch(e) {
                    console.log("Error in cardDestribution(): " + (e && e.message) || e.toString());
                }
            }

            function playersStatusForDealInit() {
                try {
                    leftPlayerStatus = [0, 0, 0, 0, 0, 0];
                    rightPlayerStatus = [0, 0, 0, 0, 0, 0];
                    middlePlayerStatus = [0, 0, 0, 0, 0, 0];
                    humanPlayerStatus = [0, 0, 0, 0, 0, 0];
                } catch(e) {
                    console.log("Error in playersStatusForDealInit(): " + (e && e.message) || e.toString());
                }
            }

            function playersStatusForDealSet(human, right, middle, left) {
                try {
                    var humanSuitVal = human.suitNumber;
                    var rightSuitVal = right.suitNumber;
                    var middleSuitVal = middle.suitNumber;
                    var leftSuitVal = left.suitNumber;

                    humanPlayerStatus[humanSuitVal - 1] = humanSuitVal;
                    rightPlayerStatus[rightSuitVal - 1] = rightSuitVal;
                    middlePlayerStatus[middleSuitVal - 1] = middleSuitVal;
                    leftPlayerStatus[leftSuitVal - 1] = leftSuitVal;

                    if (human.priorityLevel == 1) {
                        humanPlayerStatus[4] = 5;
                    }
                    if (human.value >= 11) {
                        humanPlayerStatus[5] = 6;
                    }
                    if (right.priorityLevel == 1) {
                        rightPlayerStatus[4] = 5;
                    }
                    if (right.value >= 11) {
                        rightPlayerStatus[5] = 6;
                    }
                    if (middle.priorityLevel == 1) {
                        middlePlayerStatus[4] = 5;
                    }
                    if (middle.value >= 11) {
                        middlePlayerStatus[5] = 6;
                    }
                    if (left.priorityLevel == 1) {
                        leftPlayerStatus[4] = 5;
                    }
                    if (left.value >= 11) {
                        leftPlayerStatus[5] = 6;
                    }
                } catch(e) {
                    console.log("Error in playersStatusForDealSet(): " + (e && e.message) || e.toString());
                }
            }

            function isLeftPlayerSideOff() {
                try {
                    for (var i = 0; i < 4; i++) {
                        if (leftPlayerStatus[i] == 0) {
                            return true;
                        }
                    }
                    return false;
                } catch(e) {
                    console.log("Error in isLeftPlayerSideOff(): " + (e && e.message) || e.toString());
                }

            }

            function isRightPlayerSideOff() {
                try {
                    for (var i = 0; i < 4; i++) {
                        if (rightPlayerStatus[i] == 0) {
                            return true;
                        }
                    }
                    return false;
                } catch(e) {
                    console.log("Error in isRightPlayerSideOff(): " + (e && e.message) || e.toString());
                }
            }

            function isMiddlePlayerSideOff() {
                try {
                    for (var i = 0; i < 4; i++) {
                        if (middlePlayerStatus[i] == 0) {
                            return true;
                        }
                    }
                    return false;
                } catch(e) {
                    console.log("Error in isMiddlePlayerSideOff(): " + (e && e.message) || e.toString());
                }
            }

            function isHumanPlayerSideOff() {
                try {
                    for (var i = 0; i < 4; i++) {
                        if (humanPlayerStatus[i] == 0) {
                            return true;
                        }
                    }
                    return false;
                } catch(e) {
                    console.log("Error in isHumanPlayerSideOff(): " + (e && e.message) || e.toString());
                }
            }

            function isSpades() {
                try {
                    if (leftPlayerStatus[4] != 5 || rightPlayerStatus[4] != 5 || middlePlayerStatus[4] != 5 || humanPlayerStatus[4] != 5) {
                        return false;
                    }
                    return true;
                } catch(e) {
                    console.log("Error in isSpades(): " + (e && e.message) || e.toString());
                }
            }

            function isHonors() {
                try {
                    if (leftPlayerStatus[5] != 6 || rightPlayerStatus[5] != 6 || middlePlayerStatus[5] != 6 || humanPlayerStatus[5] != 6) {
                        return false;
                    }
                    return true;
                } catch(e) {
                    console.log("Error in isHonors(): " + (e && e.message) || e.toString());
                }
            }

            function sortPlayersDealtCard() {
                try {
                    rightPlayerCards.sort(function(a, b) {
                        return a.sortNumber - b.sortNumber;
                    });
                    middlePlayerCards.sort(function(a, b) {
                        return a.sortNumber - b.sortNumber;
                    });
                    leftPlayerCards.sort(function(a, b) {
                        return a.sortNumber - b.sortNumber;
                    });
                    humanPlayerCards.sort(function(a, b) {
                        return a.sortNumber - b.sortNumber;
                    });
                } catch(e) {
                    console.log("Error in sortPlayersDealCard(): " + (e && e.message) || e.toString());
                }
            }

            function humanCards() {
                try {
                    var percent = 67.5;
                    for (var i = 0; i < humanPlayerCards.length; i++) {
                        var interval = (i + 1) * 50;
                        var id = "image_" + i;
                        var $image = $("<img>").attr('id', id);
                        $image.addClass("imageSize");
                        $image.css("z-index", i + 1);
                        $image.attr('alt', humanPlayerCards[i].name + ' of ' + humanPlayerCards[i].suit).attr('title', humanPlayerCards[i].name + ' of ' + humanPlayerCards[i].suit).attr('src', humanPlayerCards[i].imageDir).attr('name', i).appendTo($div).fadeIn(interval);
                        $image.animate({
                            "right" : "+=" + percent + "%"
                        }, 5);
                        percent -= 4.0;
                    }

                    playersBidding();
                } catch(e) {
                    console.log("Error in humanCards(): " + (e && e.message) || e.toString());
                }
            }

            function showSideOff() {
                try {
                    if (gameSettings.sideOff == "on") {
                        if (isLeftPlayerSideOff()) {
                            isLeftSideOff = true;
                            $("#left_player_text_sideoff").fadeIn(1000);
                        }
                        if (isRightPlayerSideOff()) {
                            isRightSideOff = true;
                            $("#right_player_text_sideoff").fadeIn(1000);
                        }
                        if (isMiddlePlayerSideOff()) {
                            isMiddleSideOff = true;
                            $("#middle_player_text_sideoff").fadeIn(1000);
                        }
                        if (isHumanPlayerSideOff) {
                            isHumanSideOff = true;
                        }
                    }
                } catch(e) {
                    console.log("Error in showSideOff(): " + (e && e.message) || e.toString());
                }
            }

            /******************Card Destribution and Cards Properties End********************/
            /************************ Player Decision Making Start **********************************/
            function playersBidding() {
                try {
                    var minBid = parseInt(gameSettings.minBid);
                    leftBid = takingDecesion(leftPlayerCards, "left");
                    rightBid = takingDecesion(rightPlayerCards, "right");
                    middleBid = takingDecesion(middlePlayerCards, "middle");
                    takingDecesion(humanPlayerCards, "human");
                    leftBid = (leftBid < minBid) ? minBid : leftBid;
                    rightBid = (rightBid < minBid) ? minBid : rightBid;
                    middleBid = (middleBid < minBid) ? minBid : middleBid;
                    leftPlayerScore.currentBid = leftBid;
                    rightPlayerScore.currentBid = rightBid;
                    middlePlayerScore.currentBid = middleBid;
                    $("#curr_bid_left").html(leftBid);
                    $("#curr_bid_right").html(rightBid);
                    $("#curr_bid_middle").html(middleBid);
                    $(".history_div").fadeOut(1000);
                    $("#game_bid_menu").fadeIn(1000);
                } catch(e) {
                    console.log("Error in playersBidding(): " + (e && e.message) || e.toString());
                }
            }


            $("#bid_popup_save").click(function() {
                try {
                    humanBid = parseInt($("#bid_popup_sl").val());
                    humanPlayerScore.currentBid = humanBid;
                    var toalBid = leftBid + rightBid + middleBid + humanBid;
                    $("#curr_bid_human").html(humanBid);
                    $("#footer_current_total").html("Current Total Score: " + (toalBid)).fadeIn(1000);
                    $("#game_bid_menu").hide(500);
                    $(".history_div").fadeOut(1000);

                    setTimeout(function() {
                        if (toalBid < gameSettings.totalMinBid) {
                            alert("Minimum total bid should be at least " + gameSettings.totalMinBid + ". Please OK to get new set of cards.")
                            $("#dealButton").trigger('click');
                        } else {
                            letsPlay();
                        }
                    }, timer);
                } catch(e) {
                    console.log("Error in bid_pop_save.click: " + (e && e.message) || e.toString());
                }
            });

            function takingDecesion(cards, playerName) {
                try {
                    var clubs = new Array();
                    var diamonds = new Array();
                    var hearts = new Array();
                    var spades = new Array();
                    var clubsCount = 0;
                    var diamondsCount = 0;
                    var heartsCount = 0;
                    var spadesCount = 0;
                    var bids = 0;
                    remainedSpades = 0;

                    showSideOff();

                    for (var i = 0; i < cards.length; i++) {
                        if (cards[i].suitNumber == 1) {
                            clubs.push(cards[i]);
                        } else if (cards[i].suitNumber == 2) {
                            diamonds.push(cards[i]);
                        } else if (cards[i].suitNumber == 3) {
                            hearts.push(cards[i]);
                        } else {
                            spades.push(cards[i]);
                        }
                    }

                    switch(playerName) {
                        case "left":
                            leftPlayersCardsClass = new PlayersCards(cards);
                            leftPlayersCardsClass.clubs = clubs;
                            leftPlayersCardsClass.diamonds = diamonds;
                            leftPlayersCardsClass.hearts = hearts;
                            leftPlayersCardsClass.spades = spades;
                            break;

                        case "right":
                            rightPlayersCardsClass = new PlayersCards(cards);
                            rightPlayersCardsClass.clubs = clubs;
                            rightPlayersCardsClass.diamonds = diamonds;
                            rightPlayersCardsClass.hearts = hearts;
                            rightPlayersCardsClass.spades = spades;
                            break;

                        case "middle":
                            middlePlayersCardsClass = new PlayersCards(cards);
                            middlePlayersCardsClass.clubs = clubs;
                            middlePlayersCardsClass.diamonds = diamonds;
                            middlePlayersCardsClass.hearts = hearts;
                            middlePlayersCardsClass.spades = spades;
                            break;

                        case "human":
                            humanPlayersCardsClass = new PlayersCards(cards);
                            humanPlayersCardsClass.clubs = clubs;
                            humanPlayersCardsClass.diamonds = diamonds;
                            humanPlayersCardsClass.hearts = hearts;
                            humanPlayersCardsClass.spades = spades;
                            humanPlayersCardsClass.spades = spades;
                            break;
                    }

                    if (playerName != "human") {
                        clubsCount = clubs.length;
                        diamondsCount = diamonds.length;
                        heartsCount = hearts.length;
                        spadesCount = spades.length;
                        remainedSpades = spades.length;

                        bids += decisionBySuit(clubs, clubsCount, spades, spadesCount, false);
                        bids += decisionBySuit(diamonds, diamondsCount, spades, spadesCount, false);
                        bids += decisionBySuit(hearts, heartsCount, spades, spadesCount, false);
                        bids += decisionBySuit(spades, spadesCount, spades, spadesCount, true);
                    }
                    return bids;
                } catch(e) {
                    console.log("Error in takingDecesion(): " + (e && e.message) || e.toString());
                }
            }

            function decisionBySuit(cards, cardsCount, spades, spadesCount, isSpades) {
                try {
                    var bid = 0;
                    var randNum = 0;
                    if (!isSpades) {
                        switch(cardsCount) {
                            case 0:
                                if (remainedSpades >= 5) {
                                    randNum = getRandom(2) + 2;
                                    bid += randNum;
                                    remainedSpades -= randNum;
                                } else if (remainedSpades == 4) {
                                    randNum = getRandom(2) + 1;
                                    bid += randNum;
                                    remainedSpades -= randNum;
                                } else if (remainedSpades == 3) {
                                    bid += 1;
                                    remainedSpades -= 1;
                                } else if (remainedSpades == 2) {
                                    randNum = getRandom(2);
                                    bid += randNum;
                                    remainedSpades -= randNum;
                                }
                                break;

                            case 1:
                                if (remainedSpades >= 3) {
                                    randNum = getRandom(2) + 1;
                                    bid += randNum;
                                    remainedSpades -= randNum;
                                } else if (remainedSpades == 2) {
                                    randNum = getRandom(2);
                                    bid += randNum;
                                    remainedSpades -= randNum;
                                }
                                if (cards[0].value == 14) {
                                    bid++;
                                }
                                break;

                            case 2:
                                if (remainedSpades >= 2) {
                                    randNum = getRandom(2);
                                    bid += randNum;
                                    remainedSpades -= randNum;
                                }
                                if (cards[0].value == 13) {
                                    bid++;
                                }
                                if (cards[1].value == 14 || cards[1].value == 13) {
                                    bid++;
                                }
                                break;

                            case 3:
                                if (cards[0].value == 12) {
                                    bid += getRandom(2);
                                }
                                if (cards[1].value == 13) {
                                    bid++;
                                }
                                if (cards[2].value == 14 || cards[2].value == 13) {
                                    bid++;
                                }
                                if (cards[2].value == 12) {
                                    randNum = getRandom(2);
                                    bid += randNum;
                                }
                                break;

                            case 4:
                                if (cards[2].value == 13 || cards[2].value == 12) {
                                    bid++;
                                }
                                if (cards[3].value == 14 || cards[3].value == 13) {
                                    bid++;
                                }
                                break;

                            default:
                                if (cards[cardsCount - 1].value == 14) {
                                    bid++;
                                }
                                if (cards[cardsCount - 1].value == 13) {
                                    randNum = getRandom(2);
                                    bid += randNum;
                                }
                                break;
                        }
                    } else {
                        switch(remainedSpades) {
                            case 1:
                                if (cards[spadesCount - 1].value == 14) {
                                    bid++;
                                }
                                break;

                            case 2:
                                if (cards[spadesCount - 2].value == 13) {
                                    bid++;
                                }
                                if (cards[spadesCount - 1].value == 14 || cards[spadesCount - 1].value == 13) {
                                    bid++;
                                }
                                break;

                            case 3:
                                if (cards[spadesCount - 3].value == 12) {
                                    bid++;
                                }
                                if (cards[spadesCount - 2].value == 13) {
                                    bid++;
                                }
                                if (cards[spadesCount - 1].value == 14 || cards[spadesCount - 1].value == 13 || cards[spadesCount - 1].value == 12) {
                                    bid++;
                                }
                                break;

                            case 4:
                                if (cards[spadesCount - 4].value == 10 || cards[spadesCount - 4].value == 11) {
                                    bid++;
                                }
                                if (cards[spadesCount - 3].value == 11 || cards[spadesCount - 3].value == 12) {
                                    bid++;
                                }
                                if (cards[spadesCount - 2].value == 12 || cards[spadesCount - 2].value == 13) {
                                    bid++;
                                }
                                if (cards[spadesCount - 1].value == 13 || cards[spadesCount - 1].value == 14 || cards[spadesCount - 1].value == 12) {
                                    bid++;
                                }
                                break;
                        }
                    }
                    return bid;
                } catch(e) {
                    console.log("Error in decisionBySuite(): " + (e && e.message) || e.toString());
                }
            }

            function getRandom(num) {
                try {
                    return parseInt(Math.floor(Math.random() * num));
                } catch(e) {
                    console.log("Error in getRandom(): " + (e && e.message) || e.toString());
                }
            }

            function bidPopupMenuOptions() {
                try {
                    var menu = $("#bid_popup_sl");
                    var minBid = parseInt(gameSettings.minBid);
                    for (var i = minBid; i <= 13; i++) {
                        menu.append("<option>" + i + "</option>");
                    }
                } catch(e) {
                    console.log("Error in bidPopupMenuOptions(): " + (e && e.message) || e.toString());
                }
            }

            /************************ Player Decision Making End **********************************/

            /************************ Game Play Decision Maker Start **********************************/
            function letsPlay() {
                try {
                    var zindex = 1;
                    if (currentPlayer == 1) {
                        playedByRight(zindex);
                    } else if (currentPlayer == 2) {
                        playedByMiddle(zindex);
                    } else if (currentPlayer == 3) {
                        playedByLeft(zindex);
                    } else if (currentPlayer == 4) {
                        isHumanCardClicked = false;
                        humanCardsClickEvents(zindex);
                    }
                } catch(e) {
                    console.log("Error in leftPlay(): " + (e && e.message) || e.toString());
                }
            }

            function getSuit(cardClass, num) {
                try {
                    var suite = 0;
                    if (cardClass.clubsCount() == 0 && cardClass.diamondsCount() == 0 && cardClass.heartsCount() == 0) {
                        suite = 4;
                    } else {
                        do {
                            suite = getRandom(num) + 1;
                        } while(cardClass.getLengthOfSuit(suite) == 0);
                    }
                    return suite;
                } catch(e) {
                    console.log("Error in getSuite(): " + (e && e.message) || e.toString());
                }
            }

            function getIndexNumberForCard(playedCards, suitsCrad) {
                try {
                    var index = 0;
                    if (currentCardPlayed == 1 && gameRound == 0) {
                        if (suitsCrad.length == 2) {
                            if (suitsCrad[suitsCrad.length - 1] != 13 && suitsCrad[suitsCrad.length - 1] != 12) {
                                index = getRandom(suitsCrad.length);
                            } else {
                                index = 0;
                            }
                        } else if (suitsCrad.length >= 3) {
                            if (suitsCrad[suitsCrad.length - 2] != 12 && suitsCrad[suitsCrad.length - 2] != 11) {
                                index = getRandom(suitsCrad.length - 1);
                            } else {
                                if (suitsCrad[suitsCrad.length - 1] != 13 && suitsCrad[suitsCrad.length - 1] != 12) {
                                    index = getRandom(suitsCrad.length);
                                } else {
                                    index = getRandom(suitsCrad.length - 1);
                                }
                            }
                        } else {
                            index = getRandom(suitsCrad.length);
                        }
                    } else if (currentCardPlayed == 1 && gameRound != 0) {
                        if (suitsCrad.length == 2) {
                            if (suitsCrad[suitsCrad.length - 1] == 13) {
                                if (playedCards.length != 0 && playedCards[playedCards - 1] == 14) {
                                    index = suitsCrad.length - 1;
                                } else {
                                    index = 0;
                                }
                            } else if (suitsCrad[suitsCrad.length - 1] == 12) {
                                if (playedCards.length >= 2 && playedCards[playedCards - 1] == 14 && playedCards[playedCards - 2] == 13) {
                                    index = suitsCrad.length - 1;
                                } else {
                                    index = 0;
                                }
                            } else {
                                index = 0;
                            }
                        } else if (suitsCrad.length >= 3) {
                            if (suitsCrad[suitsCrad.length - 1] == 13) {
                                if (playedCards.length != 0 && playedCards[playedCards - 1] == 14) {
                                    index = suitsCrad.length - 1;
                                } else {
                                    if (playedCards.length >= 2 && suitsCrad[suitsCrad.length - 2] == 12) {
                                        index = getRandom(suitsCrad.length - 2);
                                    } else {
                                        index = getRandom(suitsCrad.length - 1);
                                    }
                                }
                            } else if (suitsCrad[suitsCrad.length - 1] == 12) {
                                if (playedCards.length >= 2 && playedCards[playedCards - 1] == 14 && playedCards[playedCards - 2] == 13) {
                                    index = suitsCrad.length - 1;
                                } else {
                                    index = getRandom(suitsCrad.length - 1);
                                }
                            } else {
                                index = getRandom(suitsCrad.length);
                            }
                        }
                    }
                    if (index >= suitsCrad.length || index < 0) {
                        index = 0;
                    }
                    return index;
                } catch(e) {
                    console.log("Error in getIndexNumberForCard(): " + (e && e.message) || e.toString());
                }
            }

            function getCard(playedCards, suitsCrad, cardClass, suite) {
                try {
                    var cardArray = new Array();
                    var highetsCards = new Array();
                    var lowestCards = new Array();
                    var randomCards = new Array();
                    var getCardsByIndex = new Array();
                    var index = 0;
                    getCardsByIndex = function(s, i) {
                        if (s == 1) {
                            return cardClass.getClubsByIndex(i);
                        } else if (s == 2) {
                            return cardClass.getDiamondsByIndex(i);
                        } else if (s == 3) {
                            return cardClass.getHeartsByIndex(i);
                        } else {
                            return cardClass.getSpadesByIndex(i);
                        }
                    }
                    highetsCards = function(s) {
                        if (s == 1) {
                            return cardClass.getHighestClubs();
                        } else if (s == 2) {
                            return cardClass.getHighestDiamonds();
                        } else if (s == 3) {
                            return cardClass.getHighestHearts();
                        } else {
                            return cardClass.getHighestSpades();
                        }
                    }
                    lowestCards = function(s) {
                        if (s == 1) {
                            return cardClass.getLowestClubs();
                        } else if (s == 2) {
                            return cardClass.getLowestDiamonds();
                        } else if (s == 3) {
                            return cardClass.getLowestHearts();
                        } else {
                            return cardClass.getLowestSpades();
                        }
                    }
                    randomCards = function(s) {
                        if (s == 1) {
                            return cardClass.getRandomClubs();
                        } else if (s == 2) {
                            return cardClass.getRandomDiamonds();
                        } else if (s == 3) {
                            return cardClass.getRandomHearts();
                        } else {
                            return cardClass.getRandomSpades();
                        }
                    }
                    var verifyTrioSuiteCards = function(cards) {
                        if (iHaveHigherThanPlayedCardBySortNumber(cards)) {
                            if (currentCardPlayed == 4) {
                                var indx;
                                for (var i = 0; i < cards.length; i++) {
                                    if (cards[i] > sortedNumberOfHighCard) {
                                        indx = i;
                                        break;
                                    }
                                }
                                cardArray = cardClass.getAndRemoveCard(indx, suite);
                            } else if (suitsCrad[suitsCrad.length - 1] == 14) {
                                cardArray = highetsCards(suite);
                            } else {
                                if (isContainsChoosenCardValue(playedCards, 14) == -1) {
                                    cardArray = lowestCards(suite);
                                } else {
                                    if (suitsCrad[suitsCrad.length - 1] == 13) {
                                        cardArray = highetsCards(suite);
                                    } else {
                                        if (isContainsChoosenCardValue(playedCards, 13) == -1) {
                                            cardArray = lowestCards(suite);
                                        } else {
                                            if (suitsCrad[suitsCrad.length - 1] == 12) {
                                                cardArray = highetsCards(suite);
                                            } else {
                                                if (isContainsChoosenCardValue(playedCards, 12) == -1) {
                                                    cardArray = lowestCards(suite);
                                                } else {
                                                    cardArray = highetsCards(suite);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            cardArray = lowestCards(suite);
                        }
                    }
                    var iHaveHigherThanPlayedCardBySortNumber = function(checkCards) {
                        for (var i = 0; i < checkCards.length; i++) {
                            if (checkCards[i] > sortedNumberOfHighCard) {
                                return true;
                            }
                        }
                        return false;
                    }
                    var isContainsChoosenCardValue = function(checkCards, val) {
                        for (var i = 0; i < checkCards.length; i++) {
                            if (checkCards[i] == val) {
                                return i;
                            }
                        }
                        return -1;
                    }
                    if (gameRound == 0 && currentCardPlayed == 1) {
                        if (suitsCrad[suitsCrad.length - 1] == 14) {
                            cardArray = highetsCards(suite);
                        } else {
                            if (suitsCrad.length == 1) {
                                cardArray = lowestCards(suite);
                            } else {
                                index = getIndexNumberForCard(playedCards, suitsCrad)
                                cardArray = getCardsByIndex(suite, index);
                            }
                        }
                    } else if (gameRound != 0 && currentCardPlayed == 1) {
                        if (suitsCrad[suitsCrad.length - 1] == 14) {
                            cardArray = highetsCards(suite);
                        } else {
                            if (suitsCrad.length == 1) {
                                cardArray = lowestCards(suite);
                            } else {
                                index = getIndexNumberForCard(playedCards, suitsCrad)
                                cardArray = getCardsByIndex(suite, index);
                            }
                        }
                    } else {//2nd and 3rd player any suit can use below code: verified suite by caller method
                        var cards = new Array();
                        if (suite == 1) {
                            cards = cardClass.getClubsBySortedNumber();
                            if (anySpadesPlayed) {
                                cardArray = lowestCards(suite);
                            } else {
                                verifyTrioSuiteCards(cards);
                            }
                        } else if (suite == 2) {
                            cards = cardClass.getDiamondsBySortedNumber();
                            if (anySpadesPlayed) {
                                cardArray = lowestCards(suite);
                            } else {
                                verifyTrioSuiteCards(cards);
                            }
                        } else if (suite == 3) {
                            cards = cardClass.getHeartsBySortedNumber();
                            if (anySpadesPlayed) {
                                cardArray = lowestCards(suite);
                            } else {
                                verifyTrioSuiteCards(cards);
                            }
                        } else {
                            cards = cardClass.getSpadesBySortedNumber();
                            if (firstPlayedSuite == 4) {
                                verifyTrioSuiteCards(cards);
                            } else {
                                cardArray = cardClass.getTrumCardHigherThanCurrentlyPlayed(sortedNumberOfHighCard);
                            }
                        }
                    }
                    return cardArray;
                } catch(e) {
                    console.log("Error in getCard(): " + (e && e.message) || e.toString());
                }
            }

            function checkSpadesGetSuite(cardClass) {
                try {
                    var suite;
                    if (anySpadesPlayed) {
                        if (cardClass.isContainsBiggerSpadesBySortedNumber(sortedNumberOfHighCard)) {
                            suite = 4;
                        } else {
                            suite = getSuit(cardClass, 3);
                        }
                    } else {
                        anySpadesPlayed = true;
                        suite = 4;
                    }
                    return suite;
                } catch(e) {
                    console.log("Error in checkSpadesGetSuote(): " + (e && e.message) || e.toString());
                }
            }

            function getPlayerCard(suiteOfCard, cardClass) {
                try {
                    var suite = suiteOfCard;
                    var cardArray = new Array();
                    var clubs = new Array();
                    var diamonds = new Array();
                    var hearts = new Array();
                    var spades = new Array();
                    var playedCards = new Array();

                    if (suite == 0) {
                        if (firstPlayedSuite == 1) {
                            if (cardClass.clubsCount() != 0) {
                                suite = 1;
                            } else if (cardClass.spadesCount() != 0) {
                                suite = checkSpadesGetSuite(cardClass);
                            } else {
                                suite = getSuit(cardClass, 3);
                            }
                        } else if (firstPlayedSuite == 2) {
                            if (cardClass.diamondsCount() != 0) {
                                suite = 2;
                            } else if (cardClass.spadesCount() != 0) {
                                suite = checkSpadesGetSuite(cardClass);
                            } else {
                                suite = getSuit(cardClass, 3);
                            }
                        } else if (firstPlayedSuite == 3) {
                            if (cardClass.heartsCount() != 0) {
                                suite = 3;
                            } else if (cardClass.spadesCount() != 0) {
                                suite = checkSpadesGetSuite(cardClass);
                            } else {
                                suite = getSuit(cardClass, 3);
                            }
                        } else if (firstPlayedSuite == 4) {
                            if (cardClass.spadesCount() != 0) {
                                suite = 4;
                            } else {
                                suite = getSuit(cardClass, 3);
                            }
                        }
                    }

                    switch(suite) {
                        case 1:
                            clubs = cardClass.getClubsByValue();
                            playedCards = currentTable.getClubs();
                            cardArray = getCard(playedCards, clubs, cardClass, 1);
                            currentTable.addClubs(cardArray[0].value);
                            break;

                        case 2:
                            diamonds = cardClass.getDiamondsByValue();
                            playedCards = currentTable.getDiamonds();
                            cardArray = getCard(playedCards, diamonds, cardClass, 2);
                            currentTable.addDiamonds(cardArray[0].value);
                            break;

                        case 3:
                            hearts = cardClass.getHeartsByValue();
                            playedCards = currentTable.getHearts();
                            cardArray = getCard(playedCards, hearts, cardClass, 3);
                            currentTable.addHearts(cardArray[0].value);
                            break;

                        case 4:
                            spades = cardClass.getSpadesByValue();
                            playedCards = currentTable.getSpades();
                            cardArray = getCard(playedCards, spades, cardClass, 4);
                            currentTable.addSpades(cardArray[0].value);
                            break;
                    }
                    return cardArray;
                } catch(e) {
                    console.log("Error in getPlayerCard(): " + (e && e.message) || e.toString());
                }
            }

            // //1: Right. 2: Middle. 3: Left. 4:Human.
            //Players Card Class, Player ID, Suit ID
            function getCardsFromPlayer(cardClass, player) {
                try {
                    var suite = 0;
                    //cardArray: [0]: Card Class. [1]: Index of Full Set of Card, [2]: Suite Number
                    var cardArray = new Array();

                    if (gameSettings.spadeFirst == "on" && gameRound == 0 && currentCardPlayed == 1) {
                        suite = getSuit(cardClass, 3);
                        cardArray = getPlayerCard(suite, cardClass);
                        firstPlayedSuite = cardArray[2];
                        anySpadesPlayed = false;
                    } else if (gameSettings.spadeFirst == "off" && gameRound == 0 && currentCardPlayed == 1) {
                        suite = getSuit(cardClass, 4);
                        cardArray = getPlayerCard(suite, cardClass);
                        firstPlayedSuite = cardArray[2];
                    } else if (gameRound != 0 && currentCardPlayed == 1) {
                        suite = getSuit(cardClass, 4);
                        cardArray = getPlayerCard(suite, cardClass);
                        firstPlayedSuite = cardArray[2];
                    } else {//for 2nd and 3rd player
                        cardArray = getPlayerCard(0, cardClass);
                        if (!anySpadesPlayed && cardArray[2] == 4) {
                            anySpadesPlayed = true;
                        }
                    }
                    if (firstPlayedSuite == 4) {
                        anySpadesPlayed = true;
                    }
                    fixScore(cardArray[0], player);
                    return cardArray;
                } catch(e) {
                    console.log("Error in getCardsFromPlayer(): " + (e && e.message) || e.toString());
                }
            }

            function fixScore(card, player) {
                try {
                    if (card.suitNumber != firstPlayedSuite) {
                        if (card.suitNumber == 4) {
                            if (card.sortNumber > sortedNumberOfHighCard) {
                                whoPlayedHighCard = player;
                                sortedNumberOfHighCard = card.sortNumber;
                                valueOfHighCard = card.value;
                            }
                        }
                    } else {
                        if (card.sortNumber > sortedNumberOfHighCard) {
                            whoPlayedHighCard = player;
                            sortedNumberOfHighCard = card.sortNumber;
                            valueOfHighCard = card.value;
                        }
                    }
                } catch(e) {
                    console.log("Error in fixScore(): " + (e && e.message) || e.toString());
                }
            }

            function playedByRight(zindex) {
                try {
                    var cardArrayRight = new Array();
                    $("#footer_current_player_name").html("Waiting for : " + gameSettings.right).fadeIn(1000);
                    getTimerAndIncreseCardPlayer();
                    cardArrayRight = getCardsFromPlayer(rightPlayersCardsClass, 1);
                    setTimeout(function() {
                        tableCardImagesSet($("#right_card"), rightPlayersCardsClass, zindex++, cardArrayRight[1]);
                        currentPlayer = 2;

                        if (currentCardPlayed != 4) {
                            playedByMiddle(zindex);
                        } else {
                            hideTableCardImagesSet();
                        }
                    }, timer);
                } catch(e) {
                    console.log("Error in playedByRight(): " + (e && e.message) || e.toString());
                }
            }

            function playedByMiddle(zindex) {
                try {
                    var cardArrayMiddle = new Array();
                    $("#footer_current_player_name").html("Waiting for : " + gameSettings.middle).fadeIn(1000);
                    getTimerAndIncreseCardPlayer();
                    cardArrayMiddle = getCardsFromPlayer(middlePlayersCardsClass, 2);
                    setTimeout(function() {
                        tableCardImagesSet($("#middle_card"), middlePlayersCardsClass, zindex++, cardArrayMiddle[1]);
                        currentPlayer = 3;
                        if (currentCardPlayed != 4) {
                            playedByLeft(zindex);
                        } else {
                            hideTableCardImagesSet();
                        }
                    }, timer);
                } catch(e) {
                    console.log("Error in playedByMiddle(): " + (e && e.message) || e.toString());
                }
            }

            function playedByLeft(zindex) {
                try {
                    var cardArrayLeft = new Array();
                    $("#footer_current_player_name").html("Waiting for : " + gameSettings.left).fadeIn(1000);
                    getTimerAndIncreseCardPlayer();
                    cardArrayLeft = getCardsFromPlayer(leftPlayersCardsClass, 3);
                    setTimeout(function() {
                        tableCardImagesSet($("#left_card"), leftPlayersCardsClass, zindex++, cardArrayLeft[1]);
                        currentPlayer = 4;

                        if (currentCardPlayed != 4) {
                            isHumanCardClicked = false;
                            humanCardsClickEvents(zindex);
                        } else {
                            hideTableCardImagesSet();
                        }
                    }, timer);
                } catch(e) {
                    console.log("Error in playedByLeft(): " + (e && e.message) || e.toString());
                }
            }

            function countSuitesOfHumanCards(suite) {
                try {
                    if (suite == 1) {
                        return humanPlayersCardsClass.clubsCount()
                    } else if (suite == 2) {
                        return humanPlayersCardsClass.diamondsCount()
                    } else if (suite == 3) {
                        return humanPlayersCardsClass.heartsCount()
                    } else {
                        return humanPlayersCardsClass.spadesCount()
                    }
                } catch(e) {
                    console.log("Error in countSuitesOfHumanCards(): " + (e && e.message) || e.toString());
                }
            }

            function getHumanCard(index, zindex, cardImageButton) {
                try {
                    var suiteName;
                    $("#footer_human_player_warning").hide();

                    if (firstPlayedSuite == 1) {
                        suiteName = "Clubs"
                    } else if (firstPlayedSuite == 2) {
                        suiteName = "Diamonds"
                    } else if (firstPlayedSuite == 3) {
                        suiteName = "Hearts"
                    } else if (firstPlayedSuite == 4) {
                        suiteName = "Spades"
                    }
                    var cardAction = function() {
                        var i;
                        if (humanCard.suitNumber == 1) {
                            i = humanPlayersCardsClass.getClubsByValue().indexOf(humanCard.value);
                            humanPlayersCardsClass.getAndRemoveCard(i, 1);
                            currentTable.addClubs(humanCard.value);
                        } else if (humanCard.suitNumber == 2) {
                            i = humanPlayersCardsClass.getDiamondsByValue().indexOf(humanCard.value);
                            humanPlayersCardsClass.getAndRemoveCard(i, 2);
                            currentTable.addDiamonds(humanCard.value);
                        } else if (humanCard.suitNumber == 3) {
                            i = humanPlayersCardsClass.getHeartsByValue().indexOf(humanCard.value);
                            humanPlayersCardsClass.getAndRemoveCard(i, 3);
                            currentTable.addHearts(humanCard.value);
                        } else {
                            i = humanPlayersCardsClass.getSpadesByValue().indexOf(humanCard.value);
                            humanPlayersCardsClass.getAndRemoveCard(i, 4);
                            currentTable.addSpades(humanCard.value);
                        }

                        humanCardForTableInfo(humanCard);
                        humanCardAction(cardImageButton, zindex++, index);
                    }
                    humanCard = humanPlayersCardsClass.fullSetOfCards[index];

                    if (currentCardPlayed == 1) {
                        if (gameRound == 0 && gameSettings.spadeFirst == "on") {
                            if (humanCard.suitNumber == 4) {
                                $("#footer_human_player_warning").html("You cannot play Spades first").show();
                                isHumanCardClicked = false;
                            } else {
                                cardAction();
                            }
                        } else {
                            cardAction();
                        }
                    } else {
                        if (humanCard.suitNumber != firstPlayedSuite) {
                            if (countSuitesOfHumanCards(firstPlayedSuite) != 0) {
                                $("#footer_human_player_warning").html("You cannot play: " + humanCard.name + " of " + humanCard.suit + ". You must play " + suiteName).show();
                                isHumanCardClicked = false;
                            } else {
                                if (countSuitesOfHumanCards(4) != 0) {
                                    if (humanPlayersCardsClass.isContainsBiggerSpadesBySortedNumber(sortedNumberOfHighCard) && humanCard.suitNumber != 4) {
                                        $("#footer_human_player_warning").html("You cannot play: " + humanCard.name + " of " + humanCard.suit + ". You must play " + "Spades").show();
                                        isHumanCardClicked = false;
                                    } else {
                                        cardAction();
                                    }
                                } else {
                                    cardAction();
                                }
                            }
                        } else {
                            cardAction();
                        }
                    }
                } catch(e) {
                    console.log("Error in getHumanCard(): " + (e && e.message) || e.toString());
                }
            }

            function humanCardsClickEvents(zindex) {
                try {
                    console.log("CAN YOU CLICK ME???" + zindex);
                    $("#footer_current_player_name").html("Waiting for : " + gameSettings.human).fadeIn(1000);
                    currentCardPlayed++;
                    currentCardPlayed = (currentCardPlayed > 4) ? 1 : currentCardPlayed;
                    currentPlayer = 1;

                    for (var i = 0; i < 13; i++) {
                        $("#image_" + i).bind("click", {
                            index : zindex,
                            imageNum : i
                        }, humanCardsClickEventsAction);
                        $("#image_" + i).hover(mouseHoverOn, mouseHoverOff);
                    }
                } catch(e) {
                    console.log("Error in humansCardClickEvent(): " + (e && e.message) || e.toString());
                }
            }

            function humanCardsClickEventsAction(evt) {
                try {
                    var zindex = parseInt(evt.data.index);
                    var imgNum = parseInt(evt.data.imageNum);
                    if (!isHumanCardClicked) {
                        clicked = true;
                        isHumanCardClicked = true;
                        $(".history_div").fadeOut(1000);
                        getHumanCard(imgNum, zindex, $(this));
                    }
                } catch(e) {
                    console.log("Error in getHumanCard(): " + (e && e.message) || e.toString());
                }
            }

            function mouseHoverOn(evt) {
                try {
                    var pos = $(this).attr('name');
                    $(this).stop().animate({
                        "top" : '-9px',
                        "right" : cardsImagePosHuman[pos] + 2 + "%"
                    }, 500);
                } catch(e) {
                    console.log("Error in humanCardsClickEventsAction(): " + (e && e.message) || e.toString());
                }
            }

            function mouseHoverOff(evt) {
                try {
                    var pos = $(this).attr('name');
                    $(this).stop().animate({
                        "top" : '0',
                        "right" : cardsImagePosHuman[pos] + "%"
                    }, 200);
                } catch(e) {
                    console.log("Error in mouseHoverOff(): " + (e && e.message) || e.toString());
                }
            }

            function reArangeCardPositionAfterClick(from, image) {
                try {
                    for (var i = from + 1; i < 13; i++) {
                        cardsImagePosHuman[i] += 4;
                        $("#image_" + i).animate({
                            "right" : cardsImagePosHuman[i] + "%"
                        }, 500);
                    }
                } catch(e) {
                    console.log("Error in getRightPropertyOfImage(): " + (e && e.message) || e.toString());
                }
            }

            function humanCardForTableInfo(humanCard) {
                try {
                    if (currentCardPlayed == 1) {
                        firstPlayedSuite = humanCard.suitNumber;
                    }
                    fixScore(humanCard, 4);
                    if (humanCard.suitNumber == 4) {
                        anySpadesPlayed = true;
                    }
                } catch(e) {
                    console.log("Error in humanCardForTableInfo(): " + (e && e.message) || e.toString());
                }
            }

            function hideTableCardImagesSet() {
                try {
                    setCurrentScore();
                    $("#footer_current_player_name").fadeOut(1000);
                    gameRound++;
                    setTimeout(function() {
                        $("#right_card").fadeOut(350);
                        $("#middle_card").fadeOut(350);
                        $("#left_card").fadeOut(350);
                        $("#human_card").fadeOut(350);
                        $("#right_card").css('z-index', 0);
                        $("#middle_card").css('z-index', 0);
                        $("#left_card").css('z-index', 0);
                        $("#human_card").css('z-index', 0);
                    }, 1000);
                    //Decision who will play next
                    setTimeout(function() {
                        if (gameRound != 13) {
                            currentPlayer = whoPlayedHighCard;
                            resetTableInformation();
                            letsPlay();
                        } else {
                            setTotalScore();
                            var rs = rightPlayerScore.totalScore;
                            var ms = middlePlayerScore.totalScore;
                            var ls = leftPlayerScore.totalScore;
                            var hs = humanPlayerScore.totalScore;
                            var gotWinner = false;
                            var message = "Winner of Table: " + gameSettings.name + "<br/>";

                            if (rs >= gameSettings.maxGamePoints) {
                                message += gameSettings.right + "<br/>";
                                gotWinner = true;
                            }
                            if (ms >= gameSettings.maxGamePoints) {
                                message += gameSettings.middle + "<br/>";
                                gotWinner = true;
                            }
                            if (ls >= gameSettings.maxGamePoints) {
                                message += gameSettings.left + "<br/>";
                                gotWinner = true;
                            }
                            if (hs >= gameSettings.maxGamePoints) {
                                message += gameSettings.human + "<br/>";
                                gotWinner = true;
                            }
                            if (gotWinner) {
                                var result = new HistoryInformation(getFormatedDateAndtime(), gameSettings.name, gameSettings.human, hs, gameSettings.right, rs, gameSettings.middle, ms, gameSettings.left, ls, gameSettings.maxGamePoints);
                                saveHistory(result);
                                $("#lastFiveGames").fadeOut(1000);
                                $("#restart_button").fadeOut(1000);
                                $("#dealButton").fadeOut(1000);
                                $("#container").fadeOut(3000);
                                $("#winner_Message").addClass("winner").html(message).fadeIn(6000);
                            } else {
                                resetTableInformation();
                                alert("Round finished. Press OK to get new set of cards.");
                                $("#dealButton").trigger('click');
                            }
                        }
                    }, 2000);
                } catch(e) {
                    console.log("Error in hideTableCardImageSet(): " + (e && e.message) || e.toString());
                }
            }

            function setCurrentScore() {
                try {
                    if (whoPlayedHighCard == 1) {
                        rightPlayerScore.addCurrentScore(1);
                        $("#curr_score_right").html(rightPlayerScore.currentScore);
                    } else if (whoPlayedHighCard == 2) {
                        middlePlayerScore.addCurrentScore(1);
                        $("#curr_score_middle").html(middlePlayerScore.currentScore);
                    } else if (whoPlayedHighCard == 3) {
                        leftPlayerScore.addCurrentScore(1);
                        $("#curr_score_left").html(leftPlayerScore.currentScore);
                    } else {
                        humanPlayerScore.addCurrentScore(1);
                        $("#curr_score_human").html(humanPlayerScore.currentScore);
                    }
                } catch(e) {
                    console.log("Error in setCurrentScore(): " + (e && e.message) || e.toString());
                }
            }

            function setTotalScore() {
                try {
                    var extraPoints = 0;
                    var scoreFix = function(playerScore, output) {
                        if (playerScore.currentScore < playerScore.currentBid) {
                            playerScore.subTotalScore(playerScore.currentBid);
                            output.html("-" + playerScore.currentBid);
                        } else if (playerScore.currentScore > playerScore.currentBid) {
                            extraPoints = playerScore.currentScore - playerScore.currentBid;
                            if (extraPoints >= gameSettings.pointsCut) {
                                if (gameSettings.ifExtraPoints == "none") {
                                    playerScore.addTotalScore(playerScore.currentBid);
                                    output.html("+" + playerScore.currentBid);
                                } else if (gameSettings.ifExtraPoints == "extra") {
                                    playerScore.subTotalScore(extraPoints);
                                    output.html("-" + extraPoints);
                                } else if (gameSettings.ifExtraPoints == "double") {
                                    playerScore.subTotalScore(extraPoints * 2);
                                    output.html("-" + (extraPoints * 2));
                                } else {
                                    playerScore.subTotalScore(playerScore.currentBid);
                                    output.html("-" + playerScore.currentBid);
                                }
                            } else {
                                if (gameSettings.bonus == "on" && playerScore.currentBid == 8 && playerScore.currentScore >= 8) {
                                    playerScore.addTotalScore(13);
                                    output.html("+13 (Bonus)");
                                } else {
                                    playerScore.addTotalScore(playerScore.currentBid);
                                    output.html("+" + playerScore.currentBid);
                                }
                            }
                        } else {
                            if (gameSettings.bonus == "on" && playerScore.currentBid == 8 && playerScore.currentScore == 8) {
                                playerScore.addTotalScore(13);
                                output.html("+13 (Bonus)");
                            } else {
                                playerScore.addTotalScore(playerScore.currentBid);
                                output.html("+" + playerScore.currentBid);
                            }
                        }
                    }
                    scoreFix(rightPlayerScore, $("#curr_score_right"));
                    $("#curr_tscore_right").html(rightPlayerScore.totalScore);
                    scoreFix(middlePlayerScore, $("#curr_score_middle"));
                    $("#curr_tscore_middle").html(middlePlayerScore.totalScore);
                    scoreFix(leftPlayerScore, $("#curr_score_left"));
                    $("#curr_tscore_left").html(leftPlayerScore.totalScore);
                    scoreFix(humanPlayerScore, $("#curr_score_human"));
                    $("#curr_tscore_human").html(humanPlayerScore.totalScore);
                } catch(e) {
                    console.log("Error in setTotalScore(): " + (e && e.message) || e.toString());
                }
            }

            function resetTableInformation() {
                try {
                    firstPlayedSuite = 0;
                    whoPlayedHighCard = 0;
                    valueOfHighCard = 0;
                    sortedNumberOfHighCard = 0;
                    anySpadesPlayed = false;
                } catch(e) {
                    console.log("Error in resetTableInformation(): " + (e && e.message) || e.toString());
                }
            }

            function humanCardAction(image, zindex, index) {
                try {
                    tableCardImagesSet($("#human_card"), humanPlayersCardsClass, zindex, index);
                    image.hide();
                    reArangeCardPositionAfterClick(index, image);
                    setTimeout(function() {
                        if (currentCardPlayed != 4) {
                            playedByRight(zindex++);
                        } else {
                            hideTableCardImagesSet();
                        }
                    }, 500);
                } catch(e) {
                    console.log("Error in humanCardAction(): " + (e && e.message) || e.toString());
                }
            }

            function getTimerAndIncreseCardPlayer() {
                try {
                    currentCardPlayed++;
                    currentCardPlayed = (currentCardPlayed > 4) ? 1 : currentCardPlayed;
                } catch(e) {
                    console.log("Error in getTimerAndIncreaseCardPlayer(): " + (e && e.message) || e.toString());
                }
            }

            function tableCardImagesSet(image, playersCardClass, zindex, i) {
                try {
                    image.css("z-index", zindex);
                    image.attr('alt', playersCardClass.fullSetOfCards[i].name + ' of ' + playersCardClass.fullSetOfCards[i].suit).attr('title', playersCardClass.fullSetOfCards[i].name + ' of ' + playersCardClass.fullSetOfCards[i].suit).attr('src', playersCardClass.fullSetOfCards[i].imageDir).fadeIn(100);
                } catch(e) {
                    console.log("Error in tableCardImageSet(): " + (e && e.message) || e.toString());
                }
            }

            /************************ Game Play Decision Maker End **********************************/

            /******************Game's Settings and Local Storage Start*********************/

            function createLocalStorage() {
                try {
                    localStorage.setItem('name', gameSettings.name);
                    localStorage.setItem('human', gameSettings.human);
                    localStorage.setItem('left', gameSettings.left);
                    localStorage.setItem('middle', gameSettings.middle);
                    localStorage.setItem('right', gameSettings.right);
                    localStorage.setItem('sideoff', gameSettings.sideOff);
                    localStorage.setItem('mustSpades', gameSettings.mustSpade);
                    localStorage.setItem('spadeFirst', gameSettings.spadeFirst);
                    localStorage.setItem('honors', gameSettings.honors);
                    localStorage.setItem('minBid', gameSettings.minBid);
                    localStorage.setItem('totalMinBid', gameSettings.totalMinBid);
                    localStorage.setItem('pointsCut', gameSettings.pointsCut);
                    localStorage.setItem('ifExtraPoints', gameSettings.ifExtraPoints);
                    localStorage.setItem('bonus', gameSettings.bonus);
                    localStorage.setItem('maxGamePoints', gameSettings.maxGamePoints);
                    //Players Scores
                    localStorage.setItem('left_curr_score', 0);
                    localStorage.setItem('middle_curr_score', 0);
                    localStorage.setItem('right_curr_score', 0);
                    localStorage.setItem('human_curr_score', 0);
                    localStorage.setItem('left_total_score', 0);
                    localStorage.setItem('middle_total_score', 0);
                    localStorage.setItem('right_total_score', 0);
                    localStorage.setItem('human_total_score', 0);
                } catch(e) {
                    console.log("Error in createLocalStorage(): " + (e && e.message) || e.toString());
                }
            }

            function removeLocalStorage() {
                try {
                    localStorage.removeItem('game');
                    localStorage.removeItem('currentPosition');
                    //Game Settings Part
                    localStorage.removeItem('name');
                    localStorage.removeItem('human');
                    localStorage.removeItem('left');
                    localStorage.removeItem('middle');
                    localStorage.removeItem('right');
                    localStorage.removeItem('sideoff');
                    localStorage.removeItem('mustSpades');
                    localStorage.removeItem('spadeFirst');
                    localStorage.removeItem('honors');
                    localStorage.removeItem('minBid');
                    localStorage.removeItem('totalMinBid');
                    localStorage.removeItem('pointsCut');
                    localStorage.removeItem('ifExtraPoints');
                    localStorage.removeItem('bonus');
                    localStorage.removeItem('maxGamePoints');
                    //Players Scores
                    localStorage.removeItem('left_curr_score');
                    localStorage.removeItem('middle_curr_score');
                    localStorage.removeItem('right_curr_score');
                    localStorage.removeItem('human_curr_score');
                    localStorage.removeItem('left_total_score');
                    localStorage.removeItem('middle_total_score');
                    localStorage.removeItem('right_total_score');
                    localStorage.removeItem('human_total_score');
                    localStorage.removeItem('dealt_card');
                } catch(e) {
                    console.log("Error in removeLocalStorage(): " + (e && e.message) || e.toString());
                }
            }

            function getGameSettings() {
                try {
                    var name = $("#table_title_tx").val();
                    var human = $("#human_player_name").val();
                    var left = $("#left_player_name").val();
                    var middle = $("#middle_player_name").val();
                    var right = $("#right_player_name").val();
                    var sideoff = $("input:radio[name=sideoff_rd]:checked").val();
                    var mustSpades = $("input:radio[name=spades_rd]:checked").val();
                    var spadeFirst = $("input:radio[name=spade_first_rd]:checked").val();
                    var honors = $("input:radio[name=honors_rd]:checked").val();
                    var minBid = $("#min_bid_sl").val();
                    var totalMinBid = $("#min_t_bid_sl").val();
                    var pointsCut = $("#points_cut_sl").val();
                    var ifExtraPoints = $("input:radio[name=points_cut_extra_rd]:checked").val();
                    var bonus = $("input:radio[name=binus_rd]:checked").val();
                    var maxGamePoints = $("#max_game_point_sl").val();

                    gameSettings = new Settngs(name, human, left, middle, right, sideoff, mustSpades, spadeFirst, honors, minBid, totalMinBid, pointsCut, ifExtraPoints, bonus, maxGamePoints);
                    createLocalStorage();
                } catch(e) {
                    console.log("Error in gameSettings(): " + (e && e.message) || e.toString());
                }
            }

            /******************Game's Settings and Local Storage End*********************/

            /***********************Game's Classes Start****************************/

            /**
             *name: card's name, ex: ACE, TEN
             *suit: card's suit, ex: Hearts, Diamonds
             *suitNumber: Clubs:1, Diamonds:2, Hearts:3, Spades:4
             *value: card's value, 2-14
             *sortNumber: 1-52, Clubs(1-13), Diamonds(14-26), Hearts(27-39), Spades(40-52)
             *priorityLevel: 0->'Low', 1->'High' (Only Spades has value priorityLevel: 1)
             **/
            function Card(name, suit, suitNumber, value, sortNumber, priorityLevel) {
                try {
                    this.name = name;
                    this.suit = suit;
                    this.suitNumber = suitNumber;
                    this.value = value;
                    this.sortNumber = sortNumber;
                    this.priorityLevel = priorityLevel;
                    this.imageDir = "cards" + "/" + this.suit + "/" + this.name + "." + "jpg";
                    this.imageLocation = $.trim(this.imageDir);
                } catch(e) {
                    console.log("Error in Card Class: " + (e && e.message) || e.toString());
                }
            }

            function Settngs(name, human, left, middle, right, sideOff, mustSpade, spadeFirst, honors, minBid, totalMinBid, pointsCut, ifExtraPoints, bonus, maxGamePoints) {
                try {
                    this.name = name;
                    this.human = human;
                    this.left = left;
                    this.middle = middle;
                    this.right = right;
                    this.sideOff = sideOff;
                    this.mustSpade = mustSpade;
                    this.spadeFirst = spadeFirst;
                    this.honors = honors;
                    this.minBid = minBid;
                    this.totalMinBid = totalMinBid;
                    this.pointsCut = pointsCut;
                    this.ifExtraPoints = ifExtraPoints;
                    this.bonus = bonus;
                    this.maxGamePoints = maxGamePoints;
                } catch(e) {
                    console.log("Error in Settings Class: " + (e && e.message) || e.toString());
                }
            }

            function PlayerScore() {
                try {
                    this.currentScore = 0;
                    this.currentBid = 0;
                    this.totalScore = 0;

                    this.addCurrentScore = function(score) {
                        this.currentScore += score;
                    }
                    this.subCurrentScore = function(score) {
                        this.currentScore -= score;
                    }
                    this.resetCurrentScore = function() {
                        this.currentScore = 0;
                    }
                    this.addCurrentBid = function(bid) {
                        this.currentBid += bid;
                    }
                    this.resetCurrentBid = function() {
                        this.currentBid = 0;
                    }
                    this.addTotalScore = function(score) {
                        this.totalScore += score;
                    }
                    this.subTotalScore = function(score) {
                        this.totalScore -= score;
                    }
                    this.resetCurrentScoreAndBid = function() {
                        this.currentScore = 0;
                        this.currentBid = 0;
                    }
                } catch(e) {
                    console.log("Error in PlayerScore Class: " + (e && e.message) || e.toString());
                }
            }

            function Table() {
                try {
                    this.clubs = new Array();
                    this.diamonds = new Array();
                    this.hearts = new Array();
                    this.spades = new Array();

                    this.addClubs = function(val) {
                        this.clubs.push(val);
                    }
                    this.getClubs = function() {
                        return this.clubs.sort();
                    }
                    this.addDiamonds = function(val) {
                        this.diamonds.push(val);
                    }
                    this.getDiamonds = function() {
                        return this.diamonds.sort();
                    }
                    this.addHearts = function(val) {
                        this.hearts.push(val);
                    }
                    this.getHearts = function() {
                        return this.hearts.sort();
                    }
                    this.addSpades = function(val) {
                        this.spades.push(val);
                    }
                    this.getSpades = function() {
                        return this.spades.sort();
                    }
                } catch(e) {
                    console.log("Error in Table Class: " + (e && e.message) || e.toString());
                }
            }

            /**
             *  Do not use this class if cards not destributed properly
             *  Only use in takingDecesion() method to create object or after the end of dealing cards
             *  CAUSE: ERROR
             */
            function PlayersCards(cards) {
                try {
                    this.fullSetOfCards = cards;
                    this.clubs
                    this.diamonds
                    this.hearts
                    this.spades

                    this.getFullSetOfCardsName = function() {
                        var arr = new Array();
                        for (var i = 0; i < this.fullSetOfCards.length; i++) {
                            arr[i] = this.fullSetOfCards[i].name + " of " + this.fullSetOfCards[i].suit;
                        }

                        return arr;
                    }
                    this.getLengthOfSuit = function(cardSuit) {
                        switch(cardSuit) {
                            case 1:
                                return this.clubsCount();
                                break;

                            case 2:
                                return this.diamondsCount();
                                break;

                            case 3:
                                return this.heartsCount();
                                break;

                            case 4:
                                return this.spadesCount();
                                break;
                        }
                    }
                    this.getClubsByValue = function() {
                        var arr = new Array();
                        for (var i = 0; i < this.clubs.length; i++) {
                            arr[i] = this.clubs[i].value;
                        }
                        return arr;
                    }
                    this.getClubsBySortedNumber = function() {
                        var arr = new Array();
                        for (var i = 0; i < this.clubs.length; i++) {
                            arr[i] = this.clubs[i].sortNumber;
                        }
                        return arr;
                    }
                    this.getDiamondsByValue = function() {
                        var arr = new Array();
                        for (var i = 0; i < this.diamonds.length; i++) {
                            arr[i] = this.diamonds[i].value;
                        }
                        return arr;
                    }
                    this.getDiamondsBySortedNumber = function() {
                        var arr = new Array();
                        for (var i = 0; i < this.diamonds.length; i++) {
                            arr[i] = this.diamonds[i].sortNumber;
                        }
                        return arr;
                    }
                    this.getHeartsByValue = function() {
                        var arr = new Array();
                        for (var i = 0; i < this.hearts.length; i++) {
                            arr[i] = this.hearts[i].value;
                        }
                        return arr;
                    }
                    this.getHeartsBySortedNumber = function() {
                        var arr = new Array();
                        for (var i = 0; i < this.hearts.length; i++) {
                            arr[i] = this.hearts[i].sortNumber;
                        }
                        return arr;
                    }
                    this.getSpadesByValue = function() {
                        var arr = new Array();
                        for (var i = 0; i < this.spades.length; i++) {
                            arr[i] = this.spades[i].value;
                        }
                        return arr;
                    }
                    this.getSpadesBySortedNumber = function() {
                        var arr = new Array();
                        for (var i = 0; i < this.spades.length; i++) {
                            arr[i] = this.spades[i].sortNumber;
                        }
                        return arr;
                    }
                    //Culbs: 1, Diamonds: 2, Hearts: 3, Spades: 4
                    this.getAndRemoveCard = function(index, cardSuit) {
                        var removedCard = new Array();
                        //0: Card, 1: index from full set of card, 2: suit of the card
                        switch(cardSuit) {
                            case 1:
                                removedCard[0] = this.clubs[index];
                                removedCard[1] = this.fullSetOfCards.indexOf(removedCard[0]);
                                removedCard[2] = 1;
                                this.clubs.splice(index, 1);
                                break;

                            case 2:
                                removedCard[0] = this.diamonds[index];
                                removedCard[1] = this.fullSetOfCards.indexOf(removedCard[0]);
                                removedCard[2] = 2;
                                this.diamonds.splice(index, 1);
                                break;

                            case 3:
                                removedCard[0] = this.hearts[index];
                                removedCard[1] = this.fullSetOfCards.indexOf(removedCard[0]);
                                removedCard[2] = 3;
                                this.hearts.splice(index, 1);
                                break;

                            case 4:
                                removedCard[0] = this.spades[index];
                                removedCard[1] = this.fullSetOfCards.indexOf(removedCard[0]);
                                removedCard[2] = 4;
                                this.spades.splice(index, 1);
                                break;
                        }

                        console.log(removedCard[0].value + removedCard[1] + removedCard[2]);
                        return removedCard;
                    }
                    this.clubsCount = function() {
                        return this.clubs.length;
                    }
                    this.diamondsCount = function() {
                        return this.diamonds.length;
                    }
                    this.heartsCount = function() {
                        return this.hearts.length;
                    }
                    this.spadesCount = function() {
                        return this.spades.length;
                    }
                    this.getClubsByIndex = function(index) {
                        return this.getAndRemoveCard(index, 1);
                    }
                    this.getRandomClubs = function() {
                        if (this.clubsCount() != 1) {
                            return this.getAndRemoveCard(getRandom(this.clubsCount()), 1);
                        } else {
                            return this.getLowestClubs();
                        }
                    }
                    this.getHighestClubs = function() {
                        return this.getAndRemoveCard(this.clubsCount() - 1, 1);
                    }
                    this.getLowestClubs = function() {
                        return this.getAndRemoveCard(0, 1);
                    }
                    this.getDiamondsByIndex = function(index) {
                        return this.getAndRemoveCard(index, 2);
                    }
                    this.getRandomDiamonds = function() {
                        if (this.diamondsCount() != 1) {
                            return this.getAndRemoveCard(getRandom(this.diamondsCount()), 2);
                        } else {
                            return this.getLowestDiamonds();
                        }
                    }
                    this.getHighestDiamonds = function() {
                        return this.getAndRemoveCard(this.diamondsCount() - 1, 2);
                    }
                    this.getLowestDiamonds = function() {
                        return this.getAndRemoveCard(0, 2);
                    }
                    this.getHeartsByIndex = function(index) {
                        return this.getAndRemoveCard(index, 3);
                    }
                    this.getRandomHearts = function() {
                        if (this.heartsCount() != 1) {
                            return this.getAndRemoveCard(getRandom(this.heartsCount()), 3);
                        } else {
                            return this.getLowestHearts();
                        }
                    }
                    this.getHighestHearts = function() {
                        return this.getAndRemoveCard(this.heartsCount() - 1, 3);
                    }
                    this.getLowestHearts = function() {
                        return this.getAndRemoveCard(0, 3);
                    }
                    this.getSpadesByIndex = function(index) {
                        return this.getAndRemoveCard(index, 4);
                    }
                    this.getRandomSpades = function() {
                        if (this.spadesCount() != 1) {
                            return this.getAndRemoveCard(getRandom(this.spadesCount()), 4);
                        } else {
                            return this.getLowestSpades();
                        }
                    }
                    this.getHighestSpades = function() {
                        return this.getAndRemoveCard(this.spadesCount() - 1, 4);
                    }
                    this.getLowestSpades = function() {
                        return this.getAndRemoveCard(0, 4);
                    }
                    this.totalCardCount = function() {
                        return this.clubsCount() + this.diamondsCount() + this.heartsCount() + this.spadesCount();
                    }
                    this.isContainsBiggerSpadesBySortedNumber = function(val) {
                        var arr = this.getSpadesBySortedNumber();
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] > val) {
                                return true;
                            }
                        }
                        return false;
                    }
                    this.getTrumCardHigherThanCurrentlyPlayed = function(val) {
                        var arr = this.getSpadesBySortedNumber();
                        var index;
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] > val) {
                                index = i;
                                break;
                            }
                        }
                        return this.getAndRemoveCard(index, 4);
                    }
                } catch(e) {
                    console.log("Error in PlayersCard Class: " + (e && e.message) || e.toString());
                }
            }

            /***********************Game's Classes End****************************/
        } else {
            $("#container").hide();
            $("#nav_buttons").hide();
            $("#support_Message").fadeIn(1000);
        }
    }

    /*********************************History Display Functions Start*********************/
    //How many row to create in table for history
    var howManyRow = 0;
    //Store Histor objects;
    var historyItems = new Array();
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var historyClicked = false;

    $("#lastFiveGames").click(function() {
        try {
            if (!historyClicked) {
                getHistory();
                if (historyItems.length != 0) {
                    historyItems.splice(5, 5);
                    howManyRow = historyItems.length;
                    createHistoryTableBody();
                }
                $(".history_div").fadeIn(1000);
                historyClicked = true;
            }
        } catch(e) {
            console.log("Error in lastFiveGames.click: " + (e && e.message) || e.toString());
        }
    });

    $("#close_history").click(function() {
        try {
            $(".history_div").fadeOut(1000);
            setTimeout(function() {
                removeHistoryTableRow();
            }, 1001);
            historyClicked = false;
        } catch(e) {
            console.log("Error in close_history.click: " + (e && e.message) || e.toString());
        }
    });

    function createHistoryTableBody() {
        try {
            var t_body = $("#history_body");
            t_body.show();
            var generateTableRow = function() {
                for (var i = 0; i < howManyRow; i++) {
                    var tr = $("<tr>").attr('id', "row_" + i);
                    tr.appendTo(t_body);
                }
            }
            var generateTableDefination = function() {
                for (var i = 0; i < howManyRow; i++) {
                    for (var j = 0; j < 6; j++) {
                        var td = $("<td>").attr('id', "row_" + i + "_def_" + j);
                        if (j == 0) {
                            td.html(historyItems[i].dateTime);
                            td.attr('title', "Saved Game: " + historyItems[i].dateTime);
                        } else if (j == 1) {
                            td.html(historyItems[i].tableName);
                            td.attr('title', "Table Name: " + historyItems[i].tableName);
                        } else if (j == 2) {
                            td.html(historyItems[i].humanName + "<br/>(" + historyItems[i].humanScore + "/" + historyItems[i].totalScore + ")");
                            td.attr('title', historyItems[i].humanName + " had: " + historyItems[i].humanScore + " out of " + historyItems[i].totalScore);
                        } else if (j == 3) {
                            td.html(historyItems[i].rightName + "<br/>(" + historyItems[i].rightScore + "/" + historyItems[i].totalScore + ")");
                            td.attr('title', historyItems[i].rightName + " had: " + historyItems[i].rightScore + " out of " + historyItems[i].totalScore);
                        } else if (j == 4) {
                            td.html(historyItems[i].middleName + "<br/>(" + historyItems[i].middleScore + "/" + historyItems[i].totalScore + ")");
                            td.attr('title', historyItems[i].middleName + " had: " + historyItems[i].middleScore + " out of " + historyItems[i].totalScore);
                        } else {
                            td.html(historyItems[i].leftName + "<br/>(" + historyItems[i].leftScore + "/" + historyItems[i].totalScore + ")");
                            td.attr('title', historyItems[i].leftName + " had: " + historyItems[i].leftScore + " out of " + historyItems[i].totalScore);
                        }
                        td.appendTo("#row_" + i);
                    }
                }
            }
            generateTableRow();
            generateTableDefination();
        } catch(e) {
            console.log("Error in createHistoryTableBody(): " + (e && e.message) || e.toString());
        }
    }

    function removeHistoryTableRow() {
        try {
            for (var i = 0; i < howManyRow; i++) {
                var tr = $("#row_" + i);
                tr.remove();
            }
            howManyRow = 0;
        } catch(e) {
            console.log("Error in createHistoryTableBody(): " + (e && e.message) || e.toString());
        }
    }

    function getFormatedDateAndtime() {
        try {
            var formatedDateTime = "";
            var dateObj = new Date();
            var date = monthNames[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear();
            var time = dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds();
            formatedDateTime += date + ", " + time;
            return formatedDateTime;
        } catch(e) {
            console.log("Error in getFormatedDateAndtime(): " + (e && e.message) || e.toString());
        }
    }

    function saveHistory(data) {
        try {
            getHistory();
            if (historyItems != 0) {
                historyItems.splice(0, 0, data);
            } else {
                historyItems[0] = data;
            }

            localStorage.setItem('historyData', JSON.stringify(historyItems));
            historyItems = [];
        } catch(e) {
            console.log("Error in saveHistory(): " + (e && e.message) || e.toString());
        }
    }

    function getHistory() {
        try {
            var data = localStorage.getItem('historyData');
            if (data != null) {
                historyItems = JSON.parse(data);
            }
        } catch(e) {
            console.log("Error in getHistory(): " + (e && e.message) || e.toString());
        }
    }

    function clearHistory() {
        try {
            localStorage.removeItem('historyData');
            removeHistoryTableRow();
        } catch(e) {
            console.log("Error in getHistory(): " + (e && e.message) || e.toString());
        }
    }


    $("#clear_history").click(function() {
        clearHistory();
        historyItems = [];
    });

    function HistoryInformation(dt, tn, hn, hs, rn, rs, mn, ms, ln, ls, ts) {
        try {
            this.dateTime = dt;
            this.tableName = tn;
            this.humanName = hn;
            this.humanScore = hs;
            this.rightName = rn;
            this.rightScore = rs;
            this.middleName = mn;
            this.middleScore = ms;
            this.leftName = ln;
            this.leftScore = ls;
            this.totalScore = ts;
        } catch(e) {
            console.log("Error in HistoryInformation Class: " + (e && e.message) || e.toString());
        }
    }

    /*********************************History Display Functions End*********************/

    /*********************************Support Functions Start*********************/
    function supports_local_storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e) {
            return false;
        }
    }

    /*********************************Support Functions End*********************/
});

/*******Note: Need To Fix**********
 ** need to fix images (middle point and player card) on resize
 * humancardclick event sometimes have problem
 * code optimizetion
 */
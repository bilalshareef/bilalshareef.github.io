(function() {

    var textsArray = [
        'Software Consultant',
        'Cricket Fanatic',
        'FOSS Lover',
        'Zealous MCU Fan',
        'Teetotaller'
    ];
    var activeTextIndex = 0;
    var themesArray = [
        'theme-red',
        'theme-green',
        'theme-blue',
        'theme-brown',
        'theme-purple',
        'theme-orange',
        'theme-indigo',
        'theme-cyan',
        'theme-teal',
        'theme-grey'
    ];
    var lastThemeIndex = 0;

    function changeText() {
        var container = document.querySelector('.profile-description');
        container.innerHTML = textsArray[activeTextIndex];

        // Update activeTextIndex
        activeTextIndex++;
        if(activeTextIndex >= textsArray.length) {
            activeTextIndex = 0;
        }
    }

    changeText();
    setInterval(changeText, 2000);

    function changeTheme() {
        var randomIndex = Math.floor((Math.random() * themesArray.length));

        /*
         * Check if the generated random index is same as the last index.
         * If yes, increment the index by one so that same theme is not updated again.
         */
        if(randomIndex === lastThemeIndex) {
            randomIndex = (randomIndex >= (themesArray.length -1)) ? 0 : (randomIndex + 1);
        }
        document.body.className = themesArray[randomIndex];

        lastThemeIndex = randomIndex;
    }

    changeTheme();
    document.querySelector('.profile-image').addEventListener('click', changeTheme);

}());

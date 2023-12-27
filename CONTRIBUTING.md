# clear contributing guide

Thank you so much for considering contributing to 'clear'! Not only will you be helping create an amazing experience for people who play video games, but also contribute to a body that is open source and dedicated to the public domain.

## if you would like to contribute to improving the code:
[This](https://adithyaa.notion.site/1557ca8ac05e4aee8ed35e270c58ee48?v=64af609e060c4a39ba527d8f2a1ee8e2) is a notion board with a couple of ideas and features that would be cool to have in the application. If you find something
that interests you, it'd be great if you could implement it! If you need any help, you can always open up a [new issue](https://github.com/adithyasource/clear/issues) \
\
Please make sure that you do not implement any major new features that are not on the notion board before
opening an issue discussing it. This is in order to make that that the clear's original purpose of being clean, minimalistic and simple to use stays true. \
\
You'll have to fork the repository and create a new branch with your changes after which you can create a pull request. \
\
If you find any bugs, you can always open a [new issue](https://github.com/adithyasource/clear/issues) or fix the bug yourself!


## if you would like to contribute to the translations:
You would need to look at the file [Text.js](https://github.com/adithyasource/clear/blob/main/src/Text.js). Here you can find the translations for each language. The text was originally generated using Google Translate in order to get started. \
\
To update the file with more accurate translations you'll have to fork the repository and create a new branch with your changes after which you can create a pull request. \
\
You can also add a new language by adding a new simple 2-3 letter key to the JSON for every language. \
\
For example, to add a new language, say Hebrew (shortened to he)

```
  "import steam games": {
    jp: "Steam ゲームをインポートする",
    .
    .
    .
    .
    fr: "importer des jeux Steam",
    he: "your translation goes here"
  },
```

If you would like to contribute to the translations but do not know how to do so by modifying JSON or using Git/GitHub, you can create a [new issue](https://github.com/adithyasource/clear/issues) with all the improved/new translations for all the text.


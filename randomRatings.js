export class RandomRatings {
    constructor(numRatings) {
        this.ratingsArr = [];
        this.numRatings = numRatings;

        // To populate ratings array - can't call function in constructor
        let ratingSum = 0;
        for (let i = 0; i < this.numRatings; i++) {
            const rating = this.getRandomScore();
            console.log(rating);
            this.ratingsArr.push(rating);
            ratingSum += rating;
        }
        this.avgRating = this.to1Dp(ratingSum / this.numRatings);
        console.log(this.ratingsArr);
    }

    // Returns number to 1dp sometimes
    to1Dp(num) {
        if (num == 0) {
            return 0.0;
        }
        let stringFloat = num.toFixed(1);
        return parseFloat(stringFloat);
    }

    // Returns a random float from 0.0 to 10.0
    getRandomScore() {
        const score = Math.floor(Math.random() * 11); // random number between 0 and 10
        if (score === 10) {
            return this.to1Dp(score);
        }
        const decimalPart = Math.random();
        // console.log(
        //     `score: ${score}, decimal: ${decimalPart} should be ${
        //         score + decimalPart
        //     } ${(score + decimalPart).toFixed(1)}`
        // );
        return this.to1Dp(score + decimalPart);
    }
}

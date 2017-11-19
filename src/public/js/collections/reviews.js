//
//  reviews.js
//  realive
//
//  Created by Yevhenii Riabchych on 2017-10-31.
//  Copyright 2017 Yevhenii Riabchych. All rights reserved.
//

'use strict'

import { Collection } from 'backbone'
import Review from '../models/review'

class ReviewsCollection extends Collection {
  constructor () {
    super()
    this.url = 'reviews'
    this.model = Review
  }
}

export default new ReviewsCollection()

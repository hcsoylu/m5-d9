import express from "express";
import uniqid from "uniqid";
import { check, validationResult } from "express-validator";
import {
  getReviews,
  writeReviews,
  getProducts,
  writeProducts,
} from "../lib/fs-tools-review.js";
// import { writeJSON } from "fs-extra";

const router = express.Router();

router.get("/:id", async (req, res, next) => {
  try {
    const productsInDB = await getProducts();
    const product = productsInDB.find(
      (product) => product.id === req.params.id
    );

    const reviews = product.reviews;
    console.log(reviews);
    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/",
  [
    check("comment")
      .exists()
      .withMessage("please insert your comment this is important for us"),
    check("rate")
      .isInt()
      .withMessage("it has to be a number")
      .exists()
      .withMessage("please give it a shoot from 1 to 5"),
    check("productId").exists().withMessage("please insert productId"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = new Error();
        err.errorList = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        // const reviews = await getReviews();
        const { productId } = req.body;
        const newReview = { ...req.body, _id: uniqid(), createdAt: new Date() };
        let productsInDB = await getProducts();
        const product = productsInDB.find(
          (product) => product.id === productId
        );

        if (product) {
          const productNewObj = {
            ...product,
            reviews: [...product.reviews, newReview],
            updatedAt: new Date(),
          };
          productsInDB = productsInDB.filter(
            (product) => product.id !== productId
          );

          productsInDB.push(productNewObj);
          await writeProducts(productsInDB);
          res.status(201).send(newReview);
        } else {
          const error = new Error({
            message: `Product with this id is not found`,
          });
          error.httpStatusCode = 404;
          next(error);
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.put("/:reviewId", async (req, res, next) => {
  try {
    let productsInDB = await getProducts();
    let product = productsInDB.find(
      (product) => product.id === req.body.productId
    );
    if (product) {
      productsInDB = productsInDB.filter(
        (product) => product.id !== req.body.productId
      );
      let reviews = product.reviews;

      const review = reviews.find(
        (review) => review.id === req.params.reviewId
      );
      reviews = reviews.filter((review) => review._id !== req.params.reviewId);
      const reviewObj = {
        ...review,
        ...req.body,
        _id: req.params.reviewId,
        updatedAt: new Date(),
      };
      reviews.push(reviewObj);
      const productNewObj = {
        ...product,
        reviews: reviews,
        updatedAt: new Date(),
      };
      productsInDB.push(productNewObj);
      await writeProducts(productsInDB);

      res.status(201).send(reviewObj);
    } else {
      const error = new Error({ message: `Product with this id is not found` });
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    const error = new Error(err.message);
    error.httpStatusCode = 500;
    next(error);
  }
});

router.delete("/:reviewId", async (req, res, next) => {
  try {
    let productsInDB = await getProducts();
    let product = productsInDB.find(
      (product) => product.id === req.body.productId
    );

    let reviews = product.reviews;
    reviews = reviews.filter((review) => review._id !== req.params.reviewId);
    const productNewObj = {
      ...product,
      reviews: reviews,
      updatedAt: new Date(),
    };
    productsInDB = productsInDB.filter(
      (product) => product.id !== req.body.productId
    );
    productsInDB.push(productNewObj);
    await writeProducts(productsInDB);
    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
  }
});

export default router;

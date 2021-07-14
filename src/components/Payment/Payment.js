import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import CurrencyFormat from 'react-currency-format';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import axios from "../../axios";
import { useStateValue } from "../../StateProvider";
import { getBasketTotal } from "../../reducer/reducer";
import CheckoutProduct from "../Checkout/CheckoutProduct";
import "./Payment.css";
import { db } from "../../firebase";

function Payment() {
	const [{ basket, user }, dispatch] = useStateValue();

	const stripe = useStripe();
	const elements = useElements();
  const history = useHistory();

	const [disabled, setDisabled] = useState(true);
	const [clientSecret, setClientSecret] = useState(true);
	const [processing, setProcessing] = useState("");
	const [succeeded, setSucceeded] = useState(false);
	const [error, setError] = useState(null);

  useEffect(() => {
    // generate stripe client secret for charging customers
    const getClientSecret = async () => {
      const response = await axios({
        method: 'POST',
        // Stripe expects the total in a currencies subunits
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`
      });
      setClientSecret(response.data.clientSecret);
    }

    getClientSecret();
  }, [basket]);


	const handleSubmit = async (event) => {
		// where all the stripe fancy stuffs happen
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    }).then(({ paymentIntent }) => {
      // paymentIntent = payment confirmation
      db
      .collection('users')
      .doc(user?.uid)
      .collection('orders')
      .doc(paymentIntent.id)
      .set({
        basket: basket,
        amount: paymentIntent.amount,
        created: paymentIntent.created
      })

      setSucceeded(true);
      setError(null);
      setProcessing(false);

      dispatch({
        type: "EMPTY_BASKET"
      })

      history.replace("/orders");
    })
	};

	const handleChange = (event) => {
		setDisabled(event.empty);
		setError(event.error ? event.error.message : "");
	};

	return (
		<div className="payment">
			<div className="payment__container">
				<h1>
					Checkout (<Link to="/checkout">{basket?.length} items</Link>)
				</h1>

				<div className="payment__section">
					<div className="payment__title">
						<h3>Delivery Address</h3>
					</div>

					<div className="payment__address">
						<p>{user?.email}</p>
						<p>123 React Lane</p>
						<p>Los Angeles, CA</p>
					</div>
				</div>

				<div className="payment__section">
					<div className="payment__title">
						<h3>Review items and delivery</h3>
					</div>

					<div className="payment__items">
						{basket.map((item, index) => (
							<CheckoutProduct
								key={index}
								id={item.id}
								title={item.title}
								image={item.image}
								price={item.price}
								rating={item.rating}
							/>
						))}
					</div>
				</div>

				<div className="payment__section">
					<div className="payment__title">
						<h3>Payment Method</h3>
					</div>

					<div className="payment__details">
						{/* Here's some Stripe Magic */}
						<form onSubmit={handleSubmit}>
							<CardElement onChange={handleChange} className="payment__card" />

							<div className="payment__priceContainer">
								<CurrencyFormat
									renderText={(value) => (
											<h3> Order Total: {value} </h3>
									)}
									decimalScale={2}
									value={getBasketTotal(basket)}
									displayType={"text"}
									thousandSeparator={true}
									prefix={"$"}
								/>
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing...</p> : "Buy Now"}</span>
                </button>
							</div>

              {/* Error handling */}
              {error && <div>{error}</div>}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Payment;

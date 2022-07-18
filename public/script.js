paypal
  .Buttons({
    createOrder: function () {
      return fetch("/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              id: 1,
              quantity: 1,
            },
            
          ],
        }),
      })
        .then(res => {
          if (res.ok) return res.json()
          return res.json().then(json => Promise.reject(json))
        })
        .then(({ id }) => {
          return id
        })
        .catch(e => {
          console.error(e.error)
        })
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function(details){
        /* console.log(details) */
        /* paymentDetails = JSON.parse(details)
        console.log(paymentDetails) */
        window.location.replace("/on-success")
      })
    },
    onCancel: function (data) {
      window.location.replace("/on-cancel")
    }
  })
  .render("#paypal")

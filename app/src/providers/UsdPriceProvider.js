import React, { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

export const UsdPriceContext = createContext('')

export const getEtherUsdPrice = async () => {
  // fetch exchange rate.
  // https://api.kraken.com/0/public/Ticker?pair=ETHUSD).result.XETHZUSD.c.0
  const ETHUSD = await (await fetch('https://api.kraken.com/0/public/Ticker?pair=ETHUSD')).json()
  if (ETHUSD.hasOwnProperty('result')) {
    return parseFloat(ETHUSD.result.XETHZUSD.c[0])
  } else {
    return null
  }
}


// NOTE: not sure what is wrong with the bellow code, it definitely is more elegant, but there are errors sadly...
export const UsdPriceProvider = ({ children }) => {
  const [etherUsdPrice, setEtherUsdPrice] = useState(-1)

  useEffect(() => {
    // if the price has never been set, try to set it immediately
    if (etherUsdPrice < 0) {
      getEtherUsdPrice().then(setEtherUsdPrice)
    }

    const timer = setInterval(async () => {
      const newEtherUsdPrice = await getEtherUsdPrice()
      setEtherUsdPrice(newEtherUsdPrice)
    }, 1500)
    return () => clearInterval(timer)
  }, [etherUsdPrice])

  return <UsdPriceContext.Provider value={etherUsdPrice}>
    {children}
  </UsdPriceContext.Provider>
}
UsdPriceProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useUsdEthPrice = () => useContext(UsdPriceContext)

export default UsdPriceProvider

import React, { useContext, useEffect, useState } from 'react'

import Coverages from './Coverages';
import { DxcDate } from '@dxc-technology/halstack-react';
import baContext from './../context/baContext';
import useActivity from 'hooks/useActivity';
import useAia from "hooks/useAia";
import { useSelector } from 'react-redux';

/**
 * Quote new business POC to check uage of modified header
 * @constructor
 */
const Quote = () => {
    const { startActivity } = useActivity()
    const url = 'http://20.33.40.95:13211/csc/insurance/quotes/ID-mrMxYScs';

    const { fetch, patch } = useAia();
    const context = useContext(baContext);
    const baId: string = context.baId ? context.baId : '';
    const [quoteUrl, setQuote] = useState('');
    const quoteResponse = useSelector((state: any) => (quoteUrl !== '' ? state.aia[baId][quoteUrl] : {}));
    // const [frequencyOptions, setOptions] = useState([]);
    const [risksUrl, setRiskUrl] = useState<string>();
    useEffect(() => {
        startActivity();
        getData();
    }, []);

    const getLink = (response: any, linkName: string) => {
        if (response &&
            response._links &&
            response._links[linkName] &&
            response._links[linkName].href) {
            return response._links[linkName].href;
        }
    }

    const getData = () => {
        fetch(url).then((quoteRes: any) => {
            setQuote(url);
            // const option: any = getOneOfFromResponse(quoteRes.data, 'quote:frequency');
            // setOptions(option);
            if (getLink(quoteRes.data, 'quote:quote_risk_list')) {
                fetch(getLink(quoteRes.data, 'quote:quote_risk_list')).then((risksRes: any) => {
                    if (risksRes && risksRes.data && risksRes.data._links.item) {
                        setRiskUrl(risksRes.data._links.item.href)
                    }
                });
            }
        })
    };

    // const patchFrequency = (newValue: any) => {
    //     const payload = {
    //         'quote:frequency': newValue
    //     }
    //     patch(url, payload).then(() => {
    //         const tarriff = url + '/tariff_calculation';
    //         post(tarriff, {}).then();
    //     });
    // }

    const updateDate = (newValue: any, id: string) => {
        const obj = {
            [id]: newValue
        }
        patch(url, obj).then()
    };

    return (
        <>
            {quoteResponse && quoteResponse.data &&
                <>
                    {/* <div>
                        <DxcSelect
                            options={frequencyOptions}
                            onChange={patchFrequency}
                            label="Frequency"
                            margin="medium"
                        ></DxcSelect>
                    </div> */}
                    <div>
                        <DxcDate
                            label="start date"
                            format="yyyy-MM-dd"
                            onBlur={(newValue: any) => updateDate(newValue, 'quote:contract_start_date')}
                        />
                    </div>
                    {/* <div>
                        <Label label="QuoteCost" propertyName="quote:period_cost" data={quoteResponse.data} />
                    </div>
                    <div>
                        <Label label="Frequency" propertyName="quote:frequency" data={quoteResponse.data} />
                    </div> */}
                    <div>
                    Quote Start date: {quoteResponse.data['quote:contract_start_date']}
                    </div>
                </>
            }
            {risksUrl &&
                <Coverages risks={risksUrl} />
            }
        </>
    )
}

export default Quote;

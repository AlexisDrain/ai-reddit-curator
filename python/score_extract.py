test_data = """
Here are the ratings and comments for the given Reddit posts:

<permalink>/r/interestingasfuck/comments/1eahdat/unusually_large_eruption_just_happened_at/</permalink>
<rating>8</rating>
<comment>This post is informative and educational, as it discusses an unusual and potentially significant event at Yellowstone National Park. It is mindblowing to see the scale of the eruption.</comment>

<permalink>/r/clevercomebacks/comments/1eafl4q/the_san_antonio_expressnews_goes_hard/</permalink>
<rating>7</rating>
<comment>The post is hilarious and showcases a clever comeback from the San Antonio Express-News. It is an entertaining and amusing read.</comment>

<permalink>/r/politics/comments/1eag8vi/kamala_harris_calls_trump_a_sexual_predator/</permalink>
<rating>3</rating>
<comment>This post is politically charged and may be considered ragebait. Political topics can be divisive and should be approached with caution.</comment>

<permalink>/r/pics/comments/1eaghaq/look_at_who_is_the_oldest_presidential_nominee_in/</permalink>
<rating>6</rating>
<comment>The post is informative, as it highlights the age of the current presidential nominee, which is a noteworthy fact. However, it may also be considered slightly political.</comment>

<permalink>/r/todayilearned/comments/1eafg2e/til_for_15_years_during_the_cold_war_the_nuclear/</permalink>
<rating>9</rating>
<comment>This post is highly informative and educational, as it reveals an interesting historical fact about the nuclear launch codes during the Cold War. It is a mind-blowing revelation that the codes were so easily accessible.</comment>

<permalink>/r/facepalm/comments/1eagbk0/more_people_forgetting_to_tweet_from_their_black/</permalink>
<rating>7</rating>


<permalink>/r/Whatcouldgowrong/comments/1eagsya/maga_influencer_tweeting_from_the_wrong_account/</permalink>
<rating>6</rating>
<comment>The post is somewhat entertaining, as it highlights the mistake of a MAGA influencer tweeting from the wrong account. However, it also has a slight political undertone, which may be divisive.</comment>     

<permalink>/r/nextfuckinglevel/comments/1eacc3z/whale_lands_on_boat/</permalink>
<rating>9</rating>
<comment>This post is extremely impressive and can be considered mind-blowing. Seeing a whale landing on a boat is a highly unusual and extraordinary event, showcasing the power and unpredictability of nature.</comment>

<permalink>/r/WitchesVsPatriarchy/comments/1eaeyfj/police_are_domestic_terrorists_who_thrive_with/</permalink>
<rating>2</rating>
<comment>This post is highly political and controversial, making broad and inflammatory statements about the police. It is likely to be considered ragebait and may promote divisiveness.</comment>

<permalink>/r/me_irl/comments/1eae7qq/me_irl/</permalink>
<rating>7</rating>
<comment>The post is relatable and amusing, capturing a common experience or feeling that many people can identify with. It provides a lighthearted and humorous representation of the "me_irl" sentiment.</comment>   
"""

def extract_tags(fullText):
    post = {}
    post["permalink"] = fullText.split("<permalink>")[1].split("</permalink>")[0]
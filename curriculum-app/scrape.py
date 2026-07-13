import urllib.request
import re

def get_unsplash_url(query):
    url = f'https://unsplash.com/s/photos/{query}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        # Find raw image URLs in the page source
        # Unsplash image URLs look like https://images.unsplash.com/photo-1234567890-abcdef123456
        urls = re.findall(r'https://images\.unsplash\.com/photo-[0-9]{13,}-[a-zA-Z0-9]+', html)
        if urls:
            return urls[0] + '?auto=format&fit=crop&w=1200&q=80'
    except Exception as e:
        print(f'Error searching {query}: {e}')
    return None

print('Speaking:', get_unsplash_url('public-speaking'))
print('Microphone:', get_unsplash_url('microphone'))
print('Conversation:', get_unsplash_url('conversation'))
print('Checklist:', get_unsplash_url('checklist'))
print('Professional:', get_unsplash_url('professional-portrait'))
print('Meeting:', get_unsplash_url('meeting'))
print('Feedback:', get_unsplash_url('feedback'))
print('Evaluation:', get_unsplash_url('evaluation'))
